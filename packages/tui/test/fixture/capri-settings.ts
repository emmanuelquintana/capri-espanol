import { test } from "bun:test"
import { CapriConfig } from "../../src/capri-config"

// Capri keeps information off the screen by default (see capri.json). Tests that read it back from the rendered frame
// only run when capri.json shows it, and are skipped otherwise.
const model = CapriConfig.footerModel()

export const whenModelShown = model ? test : test.skip
// The footer and prompt label the default agent "Build" only when footer.name says so.
export const whenBuildLabelShown = model && CapriConfig.footerName() === "Build" ? test : test.skip
export const whenTpsShown = CapriConfig.footerTps() ? test : test.skip
export const whenThinkingShown = CapriConfig.hideThinking() ? test.skip : test
export const whenToolResultsShown = CapriConfig.hideToolResults() ? test.skip : test
