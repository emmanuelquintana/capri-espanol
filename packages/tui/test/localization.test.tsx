/** @jsxImportSource @opentui/solid */
import { expect, test } from "bun:test"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { onMount } from "solid-js"
import { testRender } from "@opentui/solid"
import { DialogCyberpsycosis } from "../src/component/dialog-cyberpsycosis"
import { ConfigProvider, resolve, type Interface } from "../src/config"
import { Keymap } from "../src/context/keymap"
import { ThemeProvider } from "../src/context/theme"
import { DialogProvider, useDialog } from "../src/ui/dialog"
import { ToastProvider } from "../src/ui/toast"
import { spanishLabel } from "../src/util/spanish"
import { stringWidth } from "../src/util/string-width"
import { TestTuiContexts } from "./fixture/tui-environment"
import { emptyThemeSource } from "./fixture/fixture"

test("translates display values while preserving unknown names and machine inputs", () => {
  const values = ["none", "off", "copy", "My custom model"]
  expect(values.map(spanishLabel)).toEqual(["ninguno", "desactivado", "copiar", "My custom model"])
  expect(values).toEqual(["none", "off", "copy", "My custom model"])
})

test.each([40, 80, 120])("Spanish level picker renders and closes by keyboard at %i columns", async (width) => {
  const service: Interface = { get: async () => ({}), update: async () => ({}) }
  function Fixture() {
    const dialog = useDialog()
    onMount(() => dialog.replace(() => <DialogCyberpsycosis />))
    return null
  }
  const app = await testRender(() => (
    <TestTuiContexts>
      <ConfigProvider config={resolve({}, { terminalSuspend: true })} service={service}>
        <Keymap.Provider>
          <ThemeProvider mode="dark" source={emptyThemeSource}>
            <ToastProvider><DialogProvider><Fixture /></DialogProvider></ToastProvider>
          </ThemeProvider>
        </Keymap.Provider>
      </ConfigProvider>
    </TestTuiContexts>
  ), { width, height: 24, kittyKeyboard: true })
  app.renderer.start()
  try {
    await app.waitForFrame((frame) => frame.includes("Ciberpsicosis") && frame.includes("Máxima"))
    const frame = app.captureCharFrame()
    for (const label of ["Desactivada", "Baja", "Media", "Máxima"]) expect(frame).toContain(label)
    expect(frame).not.toContain("�")
    expect(frame.split("\n").every((line) => stringWidth(line) <= width)).toBe(true)
    const directory = path.resolve(import.meta.dir, "../../../capri/docs/qa")
    await mkdir(directory, { recursive: true })
    await writeFile(path.join(directory, `terminal-${width}x24.txt`), frame)
    app.mockInput.pressKey("ESCAPE")
    await app.waitForFrame((next) => !next.includes("Ciberpsicosis"))
  } finally {
    app.renderer.destroy()
  }
})
