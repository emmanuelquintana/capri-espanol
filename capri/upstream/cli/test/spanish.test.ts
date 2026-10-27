import { expect, test } from "bun:test"
import { Context, Option } from "effect"
import { spanishFormatter } from "../src/framework/spanish"
import { Commands } from "../src/commands/commands"

test("localizes help without translating executable flags or values", () => {
  const text = spanishFormatter().formatHelpDoc({
    description: "Interfaz de Capri",
    usage: "capri <subcommand> [flags]",
    annotations: Context.empty(),
    flags: [{ name: "cyberpsycosis", aliases: [], type: "none|low|medium|max", description: Option.some("Nivel visual"), required: false }],
    globalFlags: [{ name: "help", aliases: ["h"], type: "boolean", description: Option.some("Show help information"), required: false }],
  })
  expect(text).toContain("DESCRIPCIÓN")
  expect(text).toContain("USO")
  expect(text).toContain("OPCIONES GLOBALES")
  expect(text).toContain("Mostrar la ayuda")
  expect(text).toContain("--cyberpsycosis")
  expect(text).toContain("none|low|medium|max")
  expect(text).not.toContain("Show help information")
})

test("keeps the original command and flag names available", () => {
  expect(Commands.name).toBe("capri")
  for (const name of ["auth", "mcp", "plugin", "models", "run", "session", "service", "mini", "pair"]) {
    expect(Commands.commands).toHaveProperty(name)
  }
})
