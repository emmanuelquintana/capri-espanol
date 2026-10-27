import { expect, test } from "bun:test"
import { SessionSystemPrompt } from "@opencode/core/session/system-prompt"

test("renders the default system prompt instructions", () => {
  const prompt = SessionSystemPrompt.make(["edit", "read", "shell"])
  expect(prompt).not.toContain("${OPENCODE_TOOL_GUIDANCE}")
  expect(prompt).toContain("Use the edit tool for targeted changes to existing text files")
})

test("assembles the Capri persona, the cyberpsycosis module and the harness guidance", () => {
  const tools = ["edit", "read", "shell"]
  const none = SessionSystemPrompt.make(tools, "none")
  const low = SessionSystemPrompt.make(tools, "low")
  const medium = SessionSystemPrompt.make(tools, "medium")
  const max = SessionSystemPrompt.make(tools, "max")
  for (const prompt of [none, low, medium, max]) {
    expect(prompt.startsWith("Eres Capri")).toBe(true)
    expect(prompt).toContain("español latinoamericano por defecto")
    expect(prompt).toContain("Use the edit tool for targeted changes to existing text files")
  }
  expect(none).toContain("Nivel de ciberpsicosis: NONE")
  expect(low).toContain("Nivel de ciberpsicosis: LOW")
  expect(medium).toContain("Nivel de ciberpsicosis: MEDIUM")
  expect(max).toContain("Nivel de ciberpsicosis: MAX")
  expect(max).toContain("Todos los límites firmes siguen vigentes")
  expect(none).not.toContain("MEDIUM")
  expect(max).not.toContain("back to the cage")
})
