export * as Capri from "./capri.js"

import { applyEdits, modify, parse, type ParseError } from "jsonc-parser"
import { mkdirSync, readFileSync, writeFileSync } from "fs"
import os from "os"
import path from "path"

// Capri's own settings, kept apart from opencode's tui.json/cli.json in ~/.config/capri/.
export const file = path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"), "capri", "capri.json")

export const levels = ["none", "low", "medium", "max"] as const
export type Level = (typeof levels)[number]

export const isLevel = (value: unknown): value is Level => levels.includes(value as Level)

function readRaw() {
  try {
    return readFileSync(file, "utf8")
  } catch {
    return undefined
  }
}

function readSettings(): Record<string, unknown> {
  const raw = readRaw()
  if (!raw) return {}
  const errors: ParseError[] = []
  const value: unknown = parse(raw, errors, { allowTrailingComma: true })
  return errors.length || typeof value !== "object" || value === null ? {} : (value as Record<string, unknown>)
}

// CAPRI_CYBERPSYCOSIS takes precedence over capri.json so a single launch can be overridden without editing the file.
export function cyberpsycosis(): Level {
  if (isLevel(process.env.CAPRI_CYBERPSYCOSIS)) return process.env.CAPRI_CYBERPSYCOSIS
  const level = readSettings().cyberpsycosis
  return isLevel(level) ? level : "none"
}

export const maxGlitchProbability = 10

// "glitchProbability" in capri.json scales how often the screen glitches: 1 is the default, 0 turns the glitch off,
// 2 doubles it. The rate still depends on the cyberpsycosis level and on how full the context window is.
export function glitchProbability(): number {
  const value = readSettings().glitchProbability
  return typeof value === "number" && Number.isFinite(value) ? Math.min(maxGlitchProbability, Math.max(0, value)) : 1
}

export function setCyberpsycosis(level: Level) {
  const raw = readRaw() ?? "{}\n"
  const edits = modify(raw, ["cyberpsycosis"], level, { formattingOptions: { insertSpaces: true, tabSize: 2 } })
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, applyEdits(raw, edits))
}
