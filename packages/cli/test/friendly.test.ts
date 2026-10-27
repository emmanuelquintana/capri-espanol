import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { Schema } from "effect"
import { Config } from "@opencode/schema/config"
import { companionAgent, companionConfig, conversationPermissions, defaults, loadPreferences, preferences, profileEnvironment } from "../src/friendly/config"
import { startFriendly, visibleMessages, type Engine } from "../src/friendly/server"
import type { SessionMessage } from "@opencode/schema/session-message"

test("companion uses valid native configuration and denies tools in its isolated profile", () => {
  expect(Schema.decodeUnknownSync(Config.Info)(companionConfig).default_agent).toBe(companionAgent)
  expect(companionConfig.permissions).toEqual([{ action: "*", resource: "*", effect: "deny" }])
  const env = profileEnvironment(path.join(tmpdir(), "capri-profile"))
  expect(env.OPENCODE_CONFIG_PROJECT_DISABLE).toBe("1")
  expect(env.OPENCODE_DISABLE_CLAUDE_CODE).toBe("1")
  expect(env.XDG_DATA_HOME).not.toBe(env.XDG_CONFIG_HOME)
})

test("preferences constrain labels and keep model identifiers intact", () => {
  expect(preferences({ name: "  Choom  ", tone: "inventado", textSize: "grande", contrast: true, model: { id: "vendor/model-es", providerID: "openrouter" } })).toEqual({ name: "Choom", tone: "natural", textSize: "grande", contrast: true, model: { id: "vendor/model-es", providerID: "openrouter" } })
  expect(preferences({ name: "x".repeat(100) }).name).toHaveLength(60)
  expect(() => preferences([])).toThrow()
})

test("chat projection excludes tool and reasoning content", () => {
  const messages = [{ id: "msg_a", type: "user", text: "Hola" }, { id: "msg_b", type: "synthetic", text: "private instructions" }, { id: "msg_c", type: "assistant", content: [{ type: "text", text: "Hey, choom." }, { type: "reasoning", text: "private reasoning" }] }] as unknown as SessionMessage.Info[]
  expect(visibleMessages(messages).map((message) => message.text)).toEqual(["Hola", "Hey, choom."])
})

async function fixture(run: (value: { base: string; token: string; directory: string; calls: { route: string; method: string; body: unknown }[]; call: (route: string, body?: unknown) => Promise<Response> }) => Promise<void>) {
  const directory = await mkdtemp(path.join(tmpdir(), "capri-friendly-"))
  const calls: { route: string; method: string; body: unknown }[] = []
  const session = { id: "ses_test", agent: companionAgent, metadata: { capriFriendly: true }, title: "Nueva conversación", time: {} }
  const engine: Engine = async <T>(route: string, method = "GET", body?: unknown) => {
    calls.push({ route, method, body })
    const data = route === "/api/integration" ? [{ id: "test", name: "Servicio de prueba", connections: [{}], methods: [{ type: "key" }] }]
      : route === "/api/model" ? [{ id: "test/model", providerID: "test", enabled: true, status: "active", name: "Modelo de prueba" }]
      : route === "/api/session?limit=100" ? [session]
      : route === "/api/session" ? session
      : route === "/api/session/ses_other" ? { ...session, metadata: {} }
      : route === "/api/session/active" ? {}
      : route.includes("/message?") ? []
      : session
    return { data } as T
  }
  const app = await startFriendly({ directory, engine, onClose: () => {} })
  const url = new URL(app.url), base = url.origin, token = url.hash.slice(1)
  const call = (route: string, body?: unknown) => fetch(base + "/friendly/" + route, { method: body === undefined ? "GET" : "POST", headers: { "X-Capri-Token": token, "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
  try { await run({ base, token, directory, calls, call }) }
  finally { app.close(); await rm(directory, { recursive: true, force: true }) }
}

test("gateway requires its local token and rejects cross-origin requests", () => fixture(async ({ base, token, call }) => {
  expect((await fetch(base + "/friendly/state")).status).toBe(401)
  expect((await fetch(base + "/friendly/state", { headers: { "X-Capri-Token": "ñ".repeat(64) } })).status).toBe(401)
  expect((await fetch(base + "/friendly/state", { headers: { "X-Capri-Token": token, Origin: "https://example.com" } })).status).toBe(403)
  expect((await call("state")).status).toBe(200)
  expect((await call("credential")).status).toBe(404)
  expect((await fetch(base + "/api/credential", { headers: { "X-Capri-Token": token } })).status).toBe(404)
}))

test("preferences persist without returning stored access keys", () => fixture(async ({ call, directory }) => {
  await call("preferences", { ...defaults, name: "Luna", model: { id: "test/model", providerID: "test" } })
  expect((await loadPreferences(directory)).name).toBe("Luna")
  const response = await call("connect", { provider: "test", key: "test-secret-do-not-return" })
  expect(response.status).toBe(200)
  expect(await response.text()).not.toContain("test-secret-do-not-return")
  expect(await (await call("state")).text()).not.toContain("test-secret-do-not-return")
}))

test("new conversations enforce the companion agent and deny rules regardless of browser input", () => fixture(async ({ call, calls }) => {
  await call("preferences", { ...defaults, model: { id: "test/model", providerID: "test" } })
  expect((await call("chat", { agent: "build", permissions: [{ effect: "allow" }] })).status).toBe(200)
  const created = calls.find((item) => item.route === "/api/session" && item.method === "POST")!.body as Record<string, unknown>
  expect(created.agent).toBe(companionAgent)
  expect(created.permissions).toEqual(conversationPermissions)
  expect(calls.find((item) => item.route.endsWith("/synthetic"))?.body).toMatchObject({ resume: false })
}))

test("chat cannot operate another session and rejects oversized messages", () => fixture(async ({ call, calls }) => {
  expect((await call("chat/ses_other/message", { text: "Hola" })).status).toBe(403)
  expect((await call("chat/ses_test/message", { text: "x".repeat(16001) })).status).toBe(400)
  expect(calls.some((item) => item.route.endsWith("/prompt"))).toBe(false)
  expect((await call("chat/ses_test/message", { text: "Hola" })).status).toBe(200)
  expect(calls.find((item) => item.route.endsWith("/prompt"))?.body).toEqual({ text: "Hola" })
  expect(calls.find((item) => item.method === "PATCH")?.body).toMatchObject({ permissions: conversationPermissions })
}))
