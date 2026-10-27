import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"
import character from "./capri.character.json"

export const companionAgent = "capri-compania"
export const conversationPermissions = [{ action: "*", resource: "*", effect: "deny" }] as const
export const companionConfig = {
  update: "disable",
  share: "disabled",
  snapshots: false,
  default_agent: companionAgent,
  permissions: conversationPermissions,
  agents: {
    [companionAgent]: {
      mode: "primary",
      description: "Conversar con Capri en español",
      system: [character.data.system_prompt, character.data.description, character.data.personality, character.data.scenario, "Ejemplos de voz; no son recuerdos reales:", character.data.mes_example.replaceAll("{{char}}", character.data.name).replaceAll("{{user}}", "Persona")].join("\n\n"),
      permissions: conversationPermissions,
    },
  },
}

export type Preferences = {
  name: string
  tone: "natural" | "cercana" | "directa"
  textSize: "normal" | "grande"
  contrast: boolean
  model?: { id: string; providerID: string }
}

export const defaults: Preferences = { name: "", tone: "natural", textSize: "normal", contrast: false }

export function preferences(value: unknown): Preferences {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Revisa los ajustes e inténtalo de nuevo.")
  const input = value as Record<string, unknown>
  const result: Preferences = {
    name: typeof input.name === "string" ? input.name.trim().slice(0, 60) : "",
    tone: input.tone === "cercana" || input.tone === "directa" ? input.tone : "natural",
    textSize: input.textSize === "grande" ? "grande" : "normal",
    contrast: input.contrast === true,
  }
  if (input.model && typeof input.model === "object") {
    const model = input.model as Record<string, unknown>
    if (typeof model.id === "string" && typeof model.providerID === "string" && model.id.length <= 200 && model.providerID.length <= 100)
      result.model = { id: model.id, providerID: model.providerID }
  }
  return result
}

export async function loadPreferences(directory: string): Promise<Preferences> {
  try { return preferences(JSON.parse(await readFile(path.join(directory, "preferencias.json"), "utf8"))) }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { ...defaults }
    throw new Error("No se pudieron leer tus ajustes. Conservamos el archivo para que puedas recuperarlo.", { cause: error })
  }
}

export async function savePreferences(directory: string, value: Preferences) {
  await mkdir(directory, { recursive: true })
  const file = path.join(directory, "preferencias.json")
  const temporary = `${file}.${crypto.randomUUID()}.tmp`
  await writeFile(temporary, JSON.stringify(value, null, 2) + "\n", { mode: 0o600 })
  await rename(temporary, file)
}

export function profileEnvironment(directory: string) {
  return {
    XDG_DATA_HOME: path.join(directory, "datos"),
    XDG_CONFIG_HOME: path.join(directory, "configuracion"),
    XDG_CACHE_HOME: path.join(directory, "cache"),
    XDG_STATE_HOME: path.join(directory, "estado"),
    OPENCODE_CONFIG_DIR: path.join(directory, "configuracion", "opencode"),
    OPENCODE_CONFIG: "",
    OPENCODE_CONFIG_PROJECT_DISABLE: "1",
    OPENCODE_DISABLE_CLAUDE_CODE: "1",
    OPENCODE_DISABLE_CLAUDE_CODE_SKILLS: "1",
    OPENCODE_FILEWATCHER_DISABLE: "1",
    OPENCODE_CONFIG_CONTENT: JSON.stringify(companionConfig),
  }
}
