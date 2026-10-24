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
    expect(prompt.startsWith("You are Capri")).toBe(true)
    expect(prompt).toContain("Use the edit tool for targeted changes to existing text files")
  }
  expect(none).toContain("Cyberpsychosis level: NONE")
  expect(low).toContain("Cyberpsychosis level: LOW")
  expect(medium).toContain("Cyberpsychosis level: MEDIUM")
  expect(max).toContain("Cyberpsychosis level: MAX")
  expect(none).not.toContain("MEDIUM")
  expect(max).not.toContain("back to the cage")
})
