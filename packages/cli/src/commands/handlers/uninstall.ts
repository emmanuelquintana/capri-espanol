import { confirm, intro, log, outro, spinner } from "@clack/prompts"
import { Service } from "@opencode/client/effect/service"
import { Global } from "@opencode/util/global"
import { Effect, FileSystem, Schedule } from "effect"
import path from "node:path"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"
import { ServerConnection } from "../../services/server-connection"
import { RetainedImage } from "../../services/retained-image"
import { Updater } from "../../services/updater"
import { handlePromptErrors, prompt, requireInteractive } from "../../ui/prompt"
import { errorMessage } from "../../util/error"

export default Runtime.handler(
  Commands.commands.uninstall,
  Effect.fn("cli.uninstall")(function* (input) {
    intro("Desinstalar Capri")
    const fs = yield* FileSystem.FileSystem
    const global = yield* Global.Service
    const updater = yield* Updater.Service
    const method = yield* updater.method()
    const removal = method ? updater.removal(method) : undefined
    // Data, config, and state hold sessions, credentials, settings, and prompt history; uninstall only removes the cache.
    // All channels share the cache. Stop background services before deleting it.
    // Read registrations directly: ServiceConfig.options() can migrate files even during a dry run.
    const services = (yield* fs.exists(global.state))
      ? (yield* fs.readDirectory(global.state)).filter((name) => /^service(?:-.*)?\.json$/.test(name))
      : []
    const shell = method === "curl" ? yield* shellConfigs(global.home) : []

    log.info(`Método de instalación: ${method ?? "desconocido"}`)
    log.message("The following global files will be removed (shared by OpenCode versions and channels):")
    if (yield* fs.exists(global.cache)) log.info(`  Cache: ${global.cache}`)
    services.forEach((name) =>
      log.info(`  Stop background service and persistent terminals: ${path.join(global.state, name)}`),
    )
    shell.forEach((file) => log.info(`  Shell PATH: ${file}`))
    if (removal) log.info(`  Package: ${removal.command.join(" ")}`)
    if (method === "curl") log.info(`  Binary (manual removal): ${process.execPath}`)
    if (!method) log.warn("No se pudo detectar el método de instalación. Elimínala manualmente después de limpiar los datos.")

    if (input.dryRun) {
      log.warn("Simulación: no se realizaron cambios")
      outro("Terminado")
      return
    }
    if (!input.force) {
      yield* requireInteractive("Usa --force para desinstalar sin terminal interactiva o --dry-run para ver una simulación.")
      const accepted = yield* prompt(() =>
        confirm({ message: "¿Seguro que quieres desinstalar?", initialValue: false }),
      )
      if (!accepted) {
        outro("Cancelado")
        return
      }
    }

    const progress = spinner()
    if (services.length) {
      progress.start("Deteniendo servicios en segundo plano...")
      yield* Effect.forEach(services, (name) =>
        Effect.gen(function* () {
          const options = { file: path.join(global.state, name) }
          yield* ServerConnection.shutdownPersistentPty(options).pipe(Effect.ignore)
          yield* Service.stop(options)
        }),
      ).pipe(
        Effect.tap(() => Effect.sync(() => progress.stop("Servicios en segundo plano detenidos"))),
        Effect.tapCause(() => Effect.sync(() => progress.stop("No se pudieron detener los servicios en segundo plano", 1))),
      )
    }

    // Links that keep an older OpenCode replaceable may still run; move them so the cache can go.
    if (process.platform === "win32") yield* RetainedImage.relocate(global.cache, global.tmp)
    const errors: string[] = []
    progress.start("Eliminando caché...")
    yield* fs.remove(global.cache, { recursive: true, force: true }).pipe(
      // Windows reports a terminated service as gone before it releases its file handles,
      // so the first removal can race that teardown.
      Effect.retry({
        while: (error) => process.platform === "win32" && error.reason._tag === "Busy",
        schedule: Schedule.max([Schedule.spaced("250 millis"), Schedule.recurs(40)]),
      }),
      Effect.tap(() => Effect.sync(() => progress.stop("Caché eliminada"))),
      Effect.catch((error) =>
        Effect.sync(() => {
          progress.stop("No se pudo eliminar la caché", 1)
          errors.push(`Cache: ${errorMessage(error)}`)
        }),
      ),
    )
    yield* Effect.forEach(shell, (file) =>
      fs.readFileString(file).pipe(
        Effect.flatMap((content) => fs.writeFileString(file, cleanShellConfig(content))),
        Effect.catch((error) => Effect.sync(() => errors.push(`Shell config ${file}: ${errorMessage(error)}`))),
      ),
    )
    if (removal) {
      progress.start(`Running ${removal.command.join(" ")}...`)
      yield* removal.run.pipe(
        Effect.tap(() => Effect.sync(() => progress.stop("Paquete eliminado"))),
        Effect.catch((error) =>
          Effect.sync(() => {
            progress.stop("Falló la desinstalación del paquete", 1)
            errors.push(errorMessage(error))
            log.warn(`Ejecuta manualmente: ${removal.command.join(" ")}`)
          }),
        ),
      )
    }
    if (method === "curl") {
      log.message("Para terminar de eliminar el ejecutable, ejecuta:")
      log.info(`  rm '${process.execPath.replaceAll("'", "'\\''")}'`)
    }
    if (errors.length) yield* Effect.fail(new Error(errors.join("\n")))
    outro("Terminado")
  }, handlePromptErrors),
)

const shellConfigs = Effect.fnUntraced(function* (home: string) {
  const fs = yield* FileSystem.FileSystem
  const bin = path.dirname(process.execPath)
  // V1 and V2 curl installs share a PATH entry; retain it while another binary uses it.
  if ((yield* fs.readDirectory(bin)).some((name) => name !== path.basename(process.execPath))) return []
  const xdg = process.env.XDG_CONFIG_HOME || path.join(home, ".config")
  const zsh = process.env.ZDOTDIR || home
  const candidates: Record<string, string[]> = {
    fish: [path.join(home, ".config/fish/config.fish"), path.join(xdg, "fish/config.fish")],
    zsh: [
      path.join(zsh, ".zshrc"),
      path.join(zsh, ".zshenv"),
      path.join(xdg, "zsh/.zshrc"),
      path.join(xdg, "zsh/.zshenv"),
    ],
    bash: [
      path.join(home, ".bashrc"),
      path.join(home, ".bash_profile"),
      path.join(home, ".profile"),
      path.join(xdg, "bash/.bashrc"),
      path.join(xdg, "bash/.bash_profile"),
    ],
    ash: [path.join(home, ".ashrc"), path.join(home, ".profile")],
    sh: [path.join(home, ".ashrc"), path.join(home, ".profile")],
  }
  const files = [...new Set(candidates[path.basename(process.env.SHELL || "bash")] ?? candidates.bash)]
  return yield* Effect.filter(files, (file) =>
    fs.readFileString(file).pipe(
      Effect.map((content) => cleanShellConfig(content) !== content),
      Effect.orElseSucceed(() => false),
    ),
  )
})

function cleanShellConfig(content: string) {
  const lines = content.split("\n")
  const entry = (line: string) =>
    /^(?:export PATH=|fish_add_path\s)/.test(line.trim()) && line.includes(".opencode/bin")
  return lines
    .filter((line, index) => !entry(line) && !(line.trim() === "# opencode" && entry(lines[index + 1] ?? "")))
    .join("\n")
}
