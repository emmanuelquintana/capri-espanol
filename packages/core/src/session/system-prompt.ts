export * as SessionSystemPrompt from "./system-prompt.js"

import { Capri } from "../capri.js"
import PROMPT from "./runner/prompt/system.txt"
import PERSONA from "./runner/prompt/capri/persona.txt"
import CYBERPSYCOSIS_NONE from "./runner/prompt/capri/cyberpsycosis-none.txt"
import CYBERPSYCOSIS_LOW from "./runner/prompt/capri/cyberpsycosis-low.txt"
import CYBERPSYCOSIS_MEDIUM from "./runner/prompt/capri/cyberpsycosis-medium.txt"
import CYBERPSYCOSIS_MAX from "./runner/prompt/capri/cyberpsycosis-max.txt"

const CYBERPSYCOSIS: Record<Capri.Level, string> = {
  none: CYBERPSYCOSIS_NONE,
  low: CYBERPSYCOSIS_LOW,
  medium: CYBERPSYCOSIS_MEDIUM,
  max: CYBERPSYCOSIS_MAX,
}

// Capri's persona and the active cyberpsycosis module replace the model-family prompts; the harness template stays
// after them for tool guidance.
export function make(tools: string[], level: Capri.Level = Capri.cyberpsycosis()) {
  return [PERSONA, CYBERPSYCOSIS[level], render(PROMPT, tools)].map((part) => part.trim()).join("\n\n")
}

export function render(prompt: string, tools: string[]) {
  const instructions: string[] = []
  if (tools.includes("shell")) {
    instructions.push(
      "- Prefer dedicated tools over shell commands; fall back to the shell when a tool cannot do what you need.",
      "- Do not chain shell commands with separators like `echo \"====\";` or `printf '---'`; the output becomes noisy in a way that makes the user's side of the conversation worse.",
    )
  }
  if (tools.includes("write")) {
    instructions.push(
      "- Use the write tool to create files or completely replace their content. Prefer using the edit tool for targeted changes.",
    )
  }
  if (tools.includes("edit")) {
    instructions.push(
      "- Use the edit tool for targeted changes to existing text files. It replaces the exact text in `oldString` with `newString`, and the values must differ. By default, `oldString` must occur exactly once. If it occurs multiple times, include more surrounding context to make it unique or set `replaceAll` to true to replace every occurrence.",
    )
  }
  return prompt.replace("${OPENCODE_TOOL_GUIDANCE}", instructions.join("\n"))
}
