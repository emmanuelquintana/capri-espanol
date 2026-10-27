import { timingSafeEqual, randomBytes } from "node:crypto"
import type { Session } from "@opencode/schema/session"
import type { SessionMessage } from "@opencode/schema/session-message"
import type { Model } from "@opencode/schema/model"
import type { Integration } from "@opencode/schema/integration"
import { companionAgent, conversationPermissions, loadPreferences, preferences, savePreferences } from "./config"
import html from "./index.html.txt"
import css from "./style.css.txt"
import javascript from "./app.js.txt"
import { logoImage } from "../../../tui/src/logo-image"

export type Engine = <T>(route: string, method?: string, body?: unknown) => Promise<T>
type Data<T> = { data: T }
export class FriendlyError extends Error {
  constructor(message: string, readonly status = 400) { super(message) }
}

function text(value: unknown, limit: number) {
  if (typeof value !== "string" || !value.trim() || value.length > limit)
    throw new FriendlyError(`Escribe un texto de entre 1 y ${limit} caracteres.`)
  return value.trim()
}

export function visibleMessages(messages: readonly SessionMessage.Info[]) {
  return messages.flatMap((message) => {
    if (message.type === "user") return [{ id: message.id, role: "user", text: message.text, error: false }]
    if (message.type !== "assistant") return []
    const content = message.content.filter((part) => part.type === "text").map((part) => part.text).join("\n\n")
    return content || message.error ? [{ id: message.id, role: "assistant", text: content, error: !!message.error }] : []
  })
}

export async function startFriendly(options: { engine: Engine; directory: string; port?: number; onClose: () => void }) {
  let prefs = await loadPreferences(options.directory)
  const token = randomBytes(32).toString("hex")
  let lastSeen = Date.now()
  let stopped = false
  const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { "Cache-Control": "no-store" } })
  const native = options.engine
  const catalog = async () => {
    const [integrations, models] = await Promise.all([
      native<Data<Integration.Info[]>>("/api/integration"), native<Data<Model.Info[]>>("/api/model"),
    ])
    const connected = new Set(integrations.data.filter((item) => item.connections.some((connection) => !connection.status)).map((item) => String(item.id)))
    // Unconnected providers have no loaded models yet; keep them available for onboarding.
    const providers = integrations.data.filter((item) => item.methods.some((method) => method.type === "key" && !method.form))
      .map((item) => ({ id: item.id, name: item.name, connected: connected.has(item.id) }))
    const available = models.data.filter((model) => model.enabled && model.status !== "deprecated" && connected.has(model.canonical ?? model.providerID))
      .map((model) => ({ id: model.id, providerID: model.providerID, name: model.name }))
    return { providers, models: available }
  }
  const owned = async (id: string) => {
    if (!/^ses_[a-zA-Z0-9_-]+$/.test(id)) throw new FriendlyError("No se encontró esa conversación.", 404)
    const response = await native<Data<Session.Info>>(`/api/session/${encodeURIComponent(id)}`)
    if (response.data.metadata?.capriFriendly !== true || response.data.agent !== companionAgent)
      throw new FriendlyError("Esta conversación pertenece a otra interfaz.", 403)
    return response.data
  }
  const authorized = (request: Request) => {
    const value = request.headers.get("X-Capri-Token") ?? ""
    return /^[a-f0-9]{64}$/.test(value) && timingSafeEqual(Buffer.from(value), Buffer.from(token))
  }
  const body = async (request: Request): Promise<Record<string, unknown>> => {
    if (!request.headers.get("content-type")?.startsWith("application/json")) throw new FriendlyError("No se pudo leer el formulario.")
    const value: unknown = await request.json()
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new FriendlyError("Revisa el formulario.")
    return value as Record<string, unknown>
  }
  const server = Bun.serve({
    hostname: "127.0.0.1", port: options.port ?? 0, maxRequestBodySize: 65536, idleTimeout: 60,
    async fetch(request) {
      const url = new URL(request.url)
      if (request.headers.get("host") !== new URL(server.url).host) return json({ error: "Conexión no permitida." }, 403)
      const origin = request.headers.get("origin")
      if (origin && origin !== server.url.origin) return json({ error: "Conexión no permitida." }, 403)
      if (request.method === "GET") {
        const headers = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "Cache-Control": "no-store", "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'" }
        if (url.pathname === "/") return new Response(html, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } })
        if (url.pathname === "/style.css") return new Response(css, { headers: { ...headers, "Content-Type": "text/css; charset=utf-8" } })
        if (url.pathname === "/app.js") return new Response(javascript, { headers: { ...headers, "Content-Type": "text/javascript; charset=utf-8" } })
        if (url.pathname === "/capri.png") return new Response(logoImage, { headers: { ...headers, "Content-Type": "image/png" } })
        if (url.pathname === "/favicon.ico") return new Response(null, { status: 204 })
      }
      if (!authorized(request)) return json({ error: "Abre Capri desde su acceso directo para recuperar la conexión." }, 401)
      lastSeen = Date.now()
      try {
        if (request.method === "GET" && url.pathname === "/friendly/state") {
          const [choices, sessions] = await Promise.all([catalog(), native<Data<Session.Info[]>>("/api/session?limit=100")])
          return json({ preferences: prefs, ...choices, sessions: sessions.data.filter((session) => session.metadata?.capriFriendly === true && !session.time.archived).map((session) => ({ id: session.id, title: session.title || "Nueva conversación", updated: session.time.updated })) })
        }
        if (request.method === "POST" && url.pathname === "/friendly/preferences") {
          const next = preferences(await body(request))
          await savePreferences(options.directory, next)
          prefs = next
          return json(prefs)
        }
        if (request.method === "POST" && url.pathname === "/friendly/connect") {
          const input = await body(request)
          const { providers } = await catalog()
          const integration = providers.find((provider) => provider.id === input.provider)
          if (!integration) throw new FriendlyError("Elige una de las conexiones disponibles.")
          await native(`/api/integration/${encodeURIComponent(integration.id)}/connect/key`, "POST", { key: text(input.key, 8192), label: "Capri · interfaz amigable" })
          return json({ connected: true })
        }
        if (request.method === "POST" && url.pathname === "/friendly/chat") {
          const input = await body(request)
          const choices = await catalog()
          const selected = choices.models.find((model) => model.id === prefs.model?.id && model.providerID === prefs.model?.providerID)
          if (!selected) throw new FriendlyError("Conecta la IA y elige un modelo en Conexión para empezar.")
          const session = await native<Data<Session.Info>>("/api/session", "POST", {
            title: typeof input.title === "string" ? input.title.slice(0, 80) : "Nueva conversación",
            agent: companionAgent, model: { id: selected.id, providerID: selected.providerID },
            location: { directory: options.directory },
            metadata: { capriFriendly: true }, permissions: conversationPermissions,
          })
          await native(`/api/session/${session.data.id}/synthetic`, "POST", {
            text: `Esta es una conversación para una persona no técnica. Tono solicitado: ${prefs.tone}. ${prefs.name ? `La persona quiere que la llames ${JSON.stringify(prefs.name)}.` : ""} Habla en español y respeta su petición si cambia de idioma.`, resume: false,
          })
          return json({ id: session.data.id })
        }
        const chat = url.pathname.match(/^\/friendly\/chat\/(ses_[a-zA-Z0-9_-]+)(?:\/(message|stop|archive))?$/)
        if (chat) {
          const [, id, action] = chat
          const session = await owned(id)
          const route = `/api/session/${id}`
          if (request.method === "GET" && !action) {
            const [messages, active] = await Promise.all([
              native<Data<SessionMessage.Info[]>>(`${route}/message?limit=200&order=desc`),
              native<Data<Record<string, unknown>>>("/api/session/active"),
            ])
            return json({ id, title: session.title, outcome: session.outcome, messages: visibleMessages(messages.data.toReversed()), active: !!active.data[id] })
          }
          if (request.method === "POST" && action === "message") {
            const input = await body(request)
            const message = text(input.text, 16000)
            await native(route, "PATCH", { permissions: conversationPermissions, ...(session.title === "Nueva conversación" ? { title: message.slice(0, 70) } : {}) })
            await native(`${route}/prompt`, "POST", { text: message })
            return json({ accepted: true })
          }
          if (request.method === "POST" && action === "stop") { await native(`${route}/interrupt`, "POST", {}); return json({ stopped: true }) }
          if (request.method === "POST" && action === "archive") { await native(route, "PATCH", { archived: true }); return json({ archived: true }) }
        }
        if (request.method === "POST" && url.pathname === "/friendly/ping") return json({ alive: true })
        if (request.method === "POST" && url.pathname === "/friendly/close") {
          setTimeout(close, 100)
          return json({ closed: true })
        }
        return json({ error: "No se encontró esa opción." }, 404)
      } catch (error) {
        if (error instanceof FriendlyError) return json({ error: error.message }, error.status)
        return json({ error: "No se pudo completar la acción. Comprueba la conexión e inténtalo de nuevo. Tu conversación sigue guardada." }, 502)
      }
    },
  })
  const timer = setInterval(() => { if (Date.now() - lastSeen > 180000) close() }, 30000)
  function close() {
    if (stopped) return
    stopped = true
    clearInterval(timer)
    void server.stop(true)
    options.onClose()
  }
  return { url: `${server.url.href}#${token}`, close, port: server.port }
}
