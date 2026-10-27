import { intro, log, outro, spinner } from "@clack/prompts"
import { Effect, Option } from "effect"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"
import { Updater } from "../../services/updater"
import { handlePromptErrors } from "../../ui/prompt"
import { OPENCODE_VERSION } from "../../version"
import { stripVTControlCharacters } from "node:util"

export default Runtime.handler(
  Commands.commands.upgrade,
  Effect.fn("cli.upgrade")(
    function* (input) {
      intro("Actualizar")
      const updater = yield* Updater.Service
      const method = Option.getOrUndefined(input.method) ?? (yield* updater.method())
      if (!method)
        return yield* Effect.fail(
          new Error("No se pudo detectar el método de instalación. Usa --method para elegir cómo actualizar Capri."),
        )

      log.info(`Método seleccionado: ${method}`)
      const target = Option.getOrUndefined(input.target) ?? (yield* updater.latest(method))
      const version = target.trim().replace(/^v/, "")
      if (version === OPENCODE_VERSION) {
        log.warn(`Se omitió la actualización de Capri: ${version} ya está instalada`)
        outro("Terminado")
        return
      }

      log.info(`De ${OPENCODE_VERSION} → ${version}`)
      const progress = spinner()
      progress.start("Actualizando…")
      yield* updater.upgrade(method, target).pipe(
        Effect.tap(() => Effect.sync(() => progress.stop("Actualización completada"))),
        Effect.tapCause(() => Effect.sync(() => progress.stop("La actualización falló", 1))),
      )
      outro("Terminado")
    },
    (effect) =>
      handlePromptErrors(
        effect.pipe(
          Effect.mapError((error) =>
            error instanceof Updater.UpgradeError ? new Error(formatUpgradeError(error), { cause: error }) : error,
          ),
        ),
      ),
  ),
)

function formatUpgradeError(error: Updater.UpgradeError) {
  const clean = (value: string) => stripVTControlCharacters(value).replaceAll("\r", "").trim()
  const line = (value: string) => clean(value).replace(/\s+/g, " ")
  const detail = wrap(clean(error.detail), Math.max(24, (process.stdout.columns ?? 80) - 7)).join("\n")
  return [
    line(error.title),
    "",
    detail,
    ...(error.command ? ["", field("Comando", line(error.command))] : []),
    field("Reintentar", line(error.retry)),
  ].join("\n")
}

function field(label: string, value: string) {
  const prefix = label.padEnd(9)
  const width = Math.max(24, Math.min(61, (process.stdout.columns ?? 80) - prefix.length - 10))
  const lines = wrap(value, width)
  return lines.map((line, index) => `${index === 0 ? prefix : " ".repeat(prefix.length)}${line}`).join("\n")
}

function wrap(value: string, width: number) {
  return value.split("\n").flatMap((source) => {
    if (source.length <= width) return [source]
    return source.split(/\s+/).reduce<string[]>((result, word) => {
      const index = result.length - 1
      if (index < 0 || result[index].length + word.length + 1 > width) result.push(word)
      else result[index] += ` ${word}`
      return result
    }, [])
  })
}
