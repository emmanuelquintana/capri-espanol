import { expect, test } from "bun:test"
import { createTestRenderer } from "@opentui/core/testing"
import { Glitch } from "../src/glitch"

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

test("glitch rate grows with the level and with context use", () => {
  expect(Glitch.spawnRate("none", 1)).toBe(0)
  expect(Glitch.spawnRate("low", 0.5)).toBeLessThan(Glitch.spawnRate("medium", 0.5))
  expect(Glitch.spawnRate("medium", 0.5)).toBeLessThan(Glitch.spawnRate("max", 0.5))
  expect(Glitch.spawnRate("medium", 0.2)).toBeLessThan(Glitch.spawnRate("medium", 0.8))
  expect(Glitch.spawnRate("low", 0)).toBeGreaterThan(0)
  expect(Glitch.spawnRate("max", 7)).toBe(Glitch.spawnRate("max", 1))
  expect(Glitch.shiftRate("max", 1)).toBeLessThan(Glitch.spawnRate("max", 1))
})

test("nothing glitches at level none", () => {
  const state = Glitch.create()
  const random = seeded(1)
  for (let i = 0; i < 2000; i++) Glitch.step(state, 0.05, { level: "none", ratio: 1, width: 80, height: 24 }, random)
  expect(Glitch.active(state)).toBe(false)
})

test("a full context at max produces rectangles and 0.5s row shifts that expire", () => {
  const state = Glitch.create()
  const random = seeded(7)
  let rects = 0
  let shifts = 0
  for (let i = 0; i < 400; i++) {
    Glitch.step(state, 0.05, { level: "max", ratio: 1, width: 80, height: 24 }, random)
    rects = Math.max(rects, state.rects.length)
    shifts = Math.max(shifts, state.shifts.length)
    for (const shift of state.shifts) expect(shift.life).toBeLessThanOrEqual(0.5)
  }
  expect(rects).toBeGreaterThan(0)
  expect(shifts).toBeGreaterThan(0)
  const quiet = { level: "none", ratio: 0, width: 80, height: 24 } as const
  for (let i = 0; i < 40; i++) Glitch.step(state, 0.05, quiet, random)
  expect(Glitch.active(state)).toBe(false)
})

test("paints rectangles and shifts a row through the renderer's post-process pass", async () => {
  const setup = await createTestRenderer({ width: 20, height: 4 })
  const state: Glitch.State = {
    rects: [{ x: 2, y: 0, width: 3, height: 1, speed: 0, color: Glitch.palette[0]!, life: 1, flicker: 0 }],
    shifts: [{ row: 1, offset: 2, life: 0.5, reroll: 1 }],
  }
  setup.renderer.addPostProcessFn((buffer) => {
    buffer.drawText("0123456789ABCDEFGHIJ", 0, 1, Glitch.palette[1]!)
    Glitch.paint(buffer, state, () => 0.99)
  })
  await setup.renderOnce()
  const lines = setup.captureCharFrame().split("\n")
  expect(lines[1]).toBe("IJ0123456789ABCDEFGH")
  const painted = setup.captureSpans().lines[0]!.spans.find((span) => span.bg.equals(Glitch.palette[0]!))
  expect(painted?.width).toBe(3)
  setup.renderer.destroy()
})
