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

// CAPRI_CYBERPSYCOSIS takes precedence over capri.json so a single launch can be overridden without editing the file.
export function cyberpsycosis(): Level {
  if (isLevel(process.env.CAPRI_CYBERPSYCOSIS)) return process.env.CAPRI_CYBERPSYCOSIS
  const raw = readRaw()
  if (!raw) return "none"
  const errors: ParseError[] = []
  const value: unknown = parse(raw, errors, { allowTrailingComma: true })
  if (errors.length || typeof value !== "object" || value === null) return "none"
  const level = (value as Record<string, unknown>).cyberpsycosis
  return isLevel(level) ? level : "none"
}

export function setCyberpsycosis(level: Level) {
  const raw = readRaw() ?? "{}\n"
  const edits = modify(raw, ["cyberpsycosis"], level, { formattingOptions: { insertSpaces: true, tabSize: 2 } })
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, applyEdits(raw, edits))
}
