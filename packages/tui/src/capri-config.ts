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
  $schema: Schema.optional(Schema.String).annotate({ description: "Esquema JSON de la configuración de Capri" }),
  logo: Schema.optional(
    Schema.Struct({
      style: Schema.optional(LogoStyle).annotate({
        description:
          "Representación del logo: 'auto' usa una imagen cuando la terminal lo permite y bloques en caso contrario; " +
          "'quadrant' y 'halfblock' fuerzan el dibujo con caracteres; 'image' fuerza la imagen si es compatible",
      }),
    }),
  ).annotate({ description: "Ajustes del logo de inicio" }),
  footer: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String).annotate({
        description: "Nombre del agente predeterminado (build) al pie de la respuesta (predeterminado: 'Capri')",
      }),
      model: Schema.optional(Schema.Boolean).annotate({ description: "Mostrar el nombre del modelo al pie (predeterminado: false)" }),
      tps: Schema.optional(Schema.Boolean).annotate({
        description: "Mostrar tokens por segundo al pie; requiere session.tps en tui.json (predeterminado: false)",
      }),
    }),
  ).annotate({ description: "Ajustes del pie de respuesta" }),
  hide: Schema.optional(
    Schema.Struct({
      thinking: Schema.optional(Schema.Boolean).annotate({
        description: "Representar el razonamiento como símbolos cifrados (predeterminado: true)",
      }),
      toolResults: Schema.optional(Schema.Boolean).annotate({
        description: "Ocultar resultados de herramientas, diferencias y diagnósticos; mostrar solo la llamada (predeterminado: true)",
      }),
      skills: Schema.optional(Schema.Boolean).annotate({
        description: "Ocultar las líneas de carga de habilidades (predeterminado: true)",
      }),
    }),
  ).annotate({ description: "Contenido que se oculta" }),
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
let hide: { thinking: boolean; toolResults: boolean; skills: boolean } | undefined
function hidden() {
  const value = read().hide
  return (hide ??= { thinking: value?.thinking ?? true, toolResults: value?.toolResults ?? true, skills: value?.skills ?? true })
}

export const hideThinking = () => hidden().thinking
export const hideToolResults = () => hidden().toolResults
export const hideSkills = () => hidden().skills

export const footerName = () => read().footer?.name ?? "Capri"
export const footerModel = () => read().footer?.model ?? false
export const footerTps = () => read().footer?.tps ?? false
