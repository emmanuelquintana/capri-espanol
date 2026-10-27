import { CliOutput } from "effect/cli"
import { Option } from "effect"

const descriptions: Record<string, string> = {
  "Show help information": "Mostrar la ayuda",
  "Show version information": "Mostrar la versión",
  "Start wizard mode for a command": "Iniciar el asistente de un comando",
  "Print shell completion script": "Mostrar el script de autocompletado de la terminal",
  "Sets the minimum log level": "Establecer el nivel mínimo de registro",
}

const headings: Record<string, string> = {
  DESCRIPTION: "DESCRIPCIÓN",
  USAGE: "USO",
  ARGUMENTS: "ARGUMENTOS",
  FLAGS: "OPCIONES",
  "GLOBAL FLAGS": "OPCIONES GLOBALES",
  SUBCOMMANDS: "SUBCOMANDOS",
  EXAMPLES: "EJEMPLOS",
}

export function spanishFormatter(): CliOutput.Formatter {
  const base = CliOutput.defaultFormatter()
  return {
    ...base,
    formatHelpDoc(doc) {
      const globalFlags = doc.globalFlags?.map((flag) => ({
        ...flag,
        description: Option.map(flag.description, (value) => descriptions[value] ?? value),
      }))
      return base.formatHelpDoc({ ...doc, globalFlags })
        .replace(/\b(DESCRIPTION|USAGE|ARGUMENTS|GLOBAL FLAGS|FLAGS|SUBCOMMANDS|EXAMPLES)\b/g, (key) => headings[key])
        .replaceAll("(optional)", "(opcional)")
        .replaceAll("(choices:", "(opciones:")
        .replaceAll("[flags]", "[opciones]")
        .replaceAll("<subcommand>", "<subcomando>")
    },
  }
}
