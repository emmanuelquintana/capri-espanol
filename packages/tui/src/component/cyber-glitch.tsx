import { createMemo, createSignal, onCleanup, createEffect } from "solid-js"
import { useRenderer, useTerminalDimensions } from "@opentui/solid"
import { Capri } from "@opencode/core/capri"
import { Glitch } from "../glitch"
import { useRoute } from "../context/route"
import { useData } from "../context/data"
import { contextUsage } from "../util/session"

const FRAME_MS = 50

const [level, setLevelSignal] = createSignal<Capri.Level>(Capri.cyberpsycosis())

export const cyberpsycosisLevel = level

// The level is stored in capri.json, so the signal re-reads it instead of trusting the value that was just written.
export function setCyberpsycosis(next: Capri.Level) {
  Capri.setCyberpsycosis(next)
  setLevelSignal(Capri.cyberpsycosis())
}

// CAPRI_GLITCH_CONTEXT (0 to 1) stands in for the context use, so the effect can be tried without a long session.
function contextOverride() {
  const value = Number(process.env.CAPRI_GLITCH_CONTEXT)
  return process.env.CAPRI_GLITCH_CONTEXT && Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : undefined
}

// Renders nothing itself: it advances the glitch state on a timer and paints it over every frame as a post-process.
export function CyberGlitch() {
  const renderer = useRenderer()
  const dimensions = useTerminalDimensions()
  const route = useRoute()
  const data = useData()

  const ratio = createMemo(() => {
    const override = contextOverride()
    if (override !== undefined) return override
    if (route.data.type !== "session") return 0
    const session = data.session.get(route.data.sessionID)
    if (!session) return 0
    const usage = contextUsage(
      data.session.message.list(route.data.sessionID),
      data.location.model.list(session.location),
      session.revert?.messageID,
    )
    return (usage?.percent ?? 0) / 100
  })

  createEffect(() => {
    if (level() === "none") return
    const state = Glitch.create()
    const paint = (buffer: Parameters<typeof Glitch.paint>[0]) => {
      if (Glitch.active(state)) Glitch.paint(buffer, state)
    }
    renderer.addPostProcessFn(paint)
    let last = performance.now()
    const timer = setInterval(() => {
      const now = performance.now()
      const dt = Math.min(0.25, (now - last) / 1000)
      last = now
      const { width, height } = dimensions()
      const was = Glitch.active(state)
      Glitch.step(state, dt, { level: level(), ratio: ratio(), width, height })
      // Redraw while glitching, and once more after the last rectangle expires so it does not stay on screen.
      if (was || Glitch.active(state)) renderer.requestRender()
    }, FRAME_MS)
    onCleanup(() => {
      clearInterval(timer)
      renderer.removePostProcessFn(paint)
      renderer.requestRender()
    })
  })

  return null
}
