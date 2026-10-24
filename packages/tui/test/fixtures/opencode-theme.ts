import { parseThemeDocument, type ModeDefinition, type ThemeDocument } from "@opencode/theme/tui"
import stock from "./opencode-stock.json" with { type: "json" }

// Frozen copy of the upstream opencode theme. The app default is Capri (dark only), so schema and resolver
// tests that need a complete light + dark document use this instead of the shipped default.
export function getOpenCodeTheme() {
  return parseThemeDocument(stock, "opencode") as ThemeDocument & {
    readonly light: ModeDefinition
    readonly dark: ModeDefinition
  }
}
