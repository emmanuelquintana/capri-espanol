import { Effect, Option } from "effect"
import { mkdir } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"
import { spawn } from "node:child_process"
import { Commands } from "../commands"
import { Runtime } from "../../framework/runtime"
import { Standalone } from "../../services/standalone"
import { Service } from "@opencode/client/effect/service"
import { profileEnvironment } from "../../friendly/config"
import { FriendlyError, startFriendly, type Engine } from "../../friendly/server"

export default Runtime.handler(Commands.commands.amigable, (input) => Effect.gen(function* () {
  const directory = path.resolve(process.env.CAPRI_FRIENDLY_HOME ?? path.join(process.env.LOCALAPPDATA ?? path.join(homedir(), ".local", "share"), "Capri", "perfil"))
  const port = Option.getOrUndefined(input.port)
  if (port !== undefined && (port < 0 || port > 65535)) return yield* Effect.fail(new Error("El puerto debe estar entre 0 y 65535."))
  yield* Effect.tryPromise(() => mkdir(directory, { recursive: true }))
  // Source workers need the CLI's Bun preload; compiled workers have it embedded.
  const sourceRuntime = ["bun", "node", "nodejs"].includes(path.basename(process.execPath, path.extname(process.execPath)).toLowerCase())
  const endpoint = yield* Standalone.start({ env: profileEnvironment(directory), cwd: sourceRuntime ? undefined : directory })
  const engine: Engine = async <T>(route: string, method = "GET", body?: unknown): Promise<T> => {
    const response = await fetch(new URL(route, endpoint.url), {
      method, headers: { ...Service.headers(endpoint), ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(45000),
    })
    if (!response.ok) throw new FriendlyError(response.status === 409 ? "Capri sigue respondiendo. Espera o pulsa Detener antes de intentarlo de nuevo." : response.status === 404 ? "No se encontró esa conversación o conexión." : "El servicio no pudo completar la acción. Revisa la clave, la conexión a internet y el acceso de tu cuenta.", response.status)
    return response.status === 204 ? undefined as T : await response.json() as T
  }
  yield* Effect.callback<void, Error>((resume) => {
    let close: (() => void) | undefined
    let cancelled = false
    startFriendly({ engine, directory, port, onClose: () => resume(Effect.void) }).then((app) => {
      close = app.close
      if (cancelled) { app.close(); return }
      process.stdout.write(`Capri está lista: ${app.url}\n`)
      if (!input.noOpen) {
        const executable = process.platform === "win32" ? "rundll32.exe" : process.platform === "darwin" ? "open" : "xdg-open"
        const args = process.platform === "win32" ? ["url.dll,FileProtocolHandler", app.url] : [app.url]
        const browser = spawn(executable, args, { windowsHide: true, detached: true, stdio: "ignore" })
        browser.on("error", () => { process.stderr.write("No se pudo abrir el navegador. Usa la dirección que aparece arriba.\n") })
        browser.unref()
      }
    }).catch((error) => resume(Effect.fail(error)))
    return Effect.sync(() => { cancelled = true; close?.() })
  })
}))
