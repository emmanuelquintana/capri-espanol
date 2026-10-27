import { CapriConfig } from "../capri-config"
import { logo, palette } from "../logo"
import { halfblockLogo, halfblockPalette } from "../logo-halfblock"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const dim = "\x1b[90m"

function wordmark(pad = "") {
  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(";")
  // Same art and size rule as the home screen logo (component/logo.tsx).
  const compact = (process.stdout.columns ?? 80) < 84 || (process.stdout.rows ?? 24) < 30
  const size = compact ? "small" : "large"
  const [art, colors] =
    CapriConfig.logoStyle() === "halfblock" ? [halfblockLogo[size], halfblockPalette] : [logo[size], palette]
  return art.map(
    (row) =>
      pad +
      row
        .map(([text, fg, bg]) => {
          if (fg === null && bg === null) return text
          const fgCode = fg === null ? "" : `\x1b[38;2;${rgb(colors[fg])}m`
          const bgCode = bg === null ? "" : `\x1b[48;2;${rgb(colors[bg])}m`
          return `${fgCode}${bgCode}${text}${reset}`
        })
        .join(""),
  )
}

export type SessionEpilogue = { readonly title: string; readonly sessionID?: string }

// Printed after the TUI closes.
export function epilogue(input: { readonly session?: SessionEpilogue; readonly updatedVersion?: string }) {
  if (!input.session && !input.updatedVersion) return
  const row = (label: string, value: string) => `  ${dim}${label.padEnd(10, " ")}${reset}${bold}${value}${reset}`
  return [
    ...wordmark("  "),
    "",
    ...(input.updatedVersion
      ? [`  ${dim}Run ${reset}${bold}opencode${reset}${dim} to use ${reset}${bold}${input.updatedVersion}${reset}`, ""]
      : []),
    ...(input.session
      ? [row("Sesión", input.session.title), row("Continuar", `opencode -s ${input.session.sessionID}`), ""]
      : []),
  ].join("\n")
}
