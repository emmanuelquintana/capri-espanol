export * as CapriConfig from "./capri-config"

import { Schema } from "effect"
import { parse, type ParseError } from "jsonc-parser"
import { readFileSync } from "fs"
import os from "os"
import path from "path"

// Capri's own settings, kept apart from opencode's tui.json/cli.json in ~/.config/capri/.
export const file = path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"), "capri", "capri.json")

export const LogoStyle = Schema.Literals(["auto", "image", "quadrant", "halfblock"])
export type LogoStyle = Schema.Schema.Type<typeof LogoStyle>

export const Info = Schema.Struct({
  $schema: Schema.optional(Schema.String).annotate({ description: "JSON Schema for Capri configuration" }),
  logo: Schema.optional(
    Schema.Struct({
      style: Schema.optional(LogoStyle).annotate({
        description:
          "Logo rendering: 'auto' uses an inline image when the terminal supports one and quadrant blocks otherwise; " +
          "'quadrant' and 'halfblock' force character art; 'image' forces the picture where supported",
      }),
    }),
  ).annotate({ description: "Startup logo settings" }),
  footer: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String).annotate({
        description: "Label shown for the default (build) agent in the reply footer (default 'Capri')",
      }),
      model: Schema.optional(Schema.Boolean).annotate({ description: "Show the model name in the footer (default false)" }),
      tps: Schema.optional(Schema.Boolean).annotate({
        description: "Show tokens per second in the footer; also needs session.tps in tui.json (default false)",
      }),
    }),
  ).annotate({ description: "Reply footer settings" }),
  hide: Schema.optional(
    Schema.Struct({
      thinking: Schema.optional(Schema.Boolean).annotate({
        description: "Show the model's reasoning as scrambled glyphs instead of readable text (default true)",
      }),
      toolResults: Schema.optional(Schema.Boolean).annotate({
        description: "Hide tool output, diffs and diagnostics; only the call itself is shown (default true)",
      }),
    }),
  ).annotate({ description: "What to keep out of sight" }),
})
export type Info = Schema.Schema.Type<typeof Info>

const decode = Schema.decodeUnknownOption(Info)
const decodeStyle = Schema.decodeUnknownOption(LogoStyle)

export function read(): Info {
  try {
    const errors: ParseError[] = []
    const value: unknown = parse(readFileSync(file, "utf8"), errors, { allowTrailingComma: true })
    if (errors.length) return {}
    const info = decode(value)
    return info._tag === "Some" ? info.value : {}
  } catch {
    return {}
  }
}

// CAPRI_LOGO takes precedence over capri.json so a single launch can be overridden without editing the file.
export function logoStyle(): LogoStyle {
  const override = decodeStyle(process.env.CAPRI_LOGO)
  if (override._tag === "Some") return override.value
  return read().logo?.style ?? "auto"
}

// read() hits the disk, and these are asked for on every render, so settle them once per process.
let hide: { thinking: boolean; toolResults: boolean } | undefined
function hidden() {
  const value = read().hide
  return (hide ??= { thinking: value?.thinking ?? true, toolResults: value?.toolResults ?? true })
}

export const hideThinking = () => hidden().thinking
export const hideToolResults = () => hidden().toolResults

export const footerName = () => read().footer?.name ?? "Capri"
export const footerModel = () => read().footer?.model ?? false
export const footerTps = () => read().footer?.tps ?? false
