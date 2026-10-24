export * as Glitch from "./glitch"

import { RGBA, type BufferAccess } from "@opentui/core"
import type { Capri } from "@opencode/core/capri"

// Capri's logo colors: green, white and magenta.
export const palette = [RGBA.fromHex("#02F968"), RGBA.fromHex("#FFFFFF"), RGBA.fromHex("#FF3885")] as const

// Rectangles per second at a full context window. The real rate scales linearly with context use, so the glitching
// grows with both the level and the length of the session.
export const weight: Record<Capri.Level, number> = { none: 0, low: 1, medium: 3, max: 8 }

// A fresh session still glitches a little at a non-zero level.
const FLOOR = 0.05
const SHIFT_SHARE = 0.25
const SHIFT_SECONDS = 0.5
const SHIFT_REROLL_SECONDS = 0.08

// `probability` is the user's glitchProbability setting: a plain multiplier on top of the level and the context use.
export const spawnRate = (level: Capri.Level, ratio: number, probability = 1) =>
  weight[level] * probability * (FLOOR + (1 - FLOOR) * Math.min(1, Math.max(0, ratio)))

export const shiftRate = (level: Capri.Level, ratio: number, probability = 1) =>
  spawnRate(level, ratio, probability) * SHIFT_SHARE

export type Rect = {
  x: number
  y: number
  width: number
  height: number
  // Cells per second, horizontal only. Negative moves left. It is re-rolled and flipped at random while the rectangle lives.
  speed: number
  color: RGBA
  life: number
  // Chance per frame of skipping the draw, which makes the rectangle flash.
  flicker: number
}

export type Shift = { row: number; offset: number; life: number; reroll: number }

export type State = { rects: Rect[]; shifts: Shift[] }

export const create = (): State => ({ rects: [], shifts: [] })

export const active = (state: State) => state.rects.length > 0 || state.shifts.length > 0

const between = (random: () => number, min: number, max: number) => min + random() * (max - min)

// A random speed in either direction, from a crawl to a streak.
const velocity = (random: () => number) => between(random, 4, 140) * (random() < 0.5 ? -1 : 1)

function spawn(state: State, size: { width: number; height: number }, random: () => number) {
  const width = Math.floor(between(random, 3, Math.max(4, Math.min(24, size.width / 3))))
  state.rects.push({
    x: Math.floor(random() * size.width),
    y: Math.floor(random() * size.height),
    width,
    height: random() < 0.8 ? 1 : 2,
    speed: velocity(random),
    color: palette[Math.floor(random() * palette.length)]!,
    life: between(random, 0.04, 0.25),
    flicker: between(random, 0.1, 0.5),
  })
}

// Advances the effect by `dt` seconds. New glitches arrive as a Poisson process at the current rates.
export function step(
  state: State,
  dt: number,
  input: { level: Capri.Level; ratio: number; probability?: number; width: number; height: number },
  random: () => number = Math.random,
) {
  if (input.width <= 0 || input.height <= 0) return
  for (const rect of state.rects) {
    rect.x += rect.speed * dt
    rect.life -= dt
    // Jitter: a new random velocity, or a sudden reversal, a few times a second.
    if (random() < 12 * dt) rect.speed = velocity(random)
    else if (random() < 10 * dt) rect.speed = -rect.speed
    // Some rectangles vanish before their time is up.
    if (random() < 3 * dt) rect.life = 0
  }
  state.rects = state.rects.filter((rect) => rect.life > 0)
  for (const shift of state.shifts) {
    shift.life -= dt
    shift.reroll -= dt
    if (shift.reroll <= 0) {
      shift.reroll = SHIFT_REROLL_SECONDS
      shift.offset = Math.round(between(random, 1, 5)) * (random() < 0.5 ? -1 : 1)
    }
  }
  state.shifts = state.shifts.filter((shift) => shift.life > 0)

  if (random() < spawnRate(input.level, input.ratio, input.probability) * dt) {
    const burst = 1 + Math.floor(random() * 4)
    for (let i = 0; i < burst; i++) spawn(state, input, random)
  }
  if (random() < shiftRate(input.level, input.ratio, input.probability) * dt) {
    state.shifts.push({ row: Math.floor(random() * input.height), offset: 0, life: SHIFT_SECONDS, reroll: 0 })
  }
}

// Moves one screen row sideways, wrapping around the edges.
export function shiftRow(cells: BufferAccess, row: number, offset: number) {
  const { width, height } = cells
  if (row < 0 || row >= height || width === 0) return
  const by = ((offset % width) + width) % width
  if (by === 0) return
  const start = row * width
  for (const plane of [cells.char, cells.fg, cells.bg, cells.attributes]) {
    const line = plane.slice(start, start + width)
    plane.set(line.subarray(width - by), start)
    plane.set(line.subarray(0, width - by), start + by)
  }
}

type Paintable = {
  withBuffers<T>(callback: (cells: BufferAccess) => T): T
  fillRect(x: number, y: number, width: number, height: number, bg: RGBA): void
  width: number
  height: number
}

// Draws the effect over a finished frame. Rows shift first so the rectangles sit on top of the shifted text.
export function paint(buffer: Paintable, state: State, random: () => number = Math.random) {
  if (state.shifts.length > 0) {
    buffer.withBuffers((cells) => {
      for (const shift of state.shifts) shiftRow(cells, shift.row, shift.offset)
    })
  }
  for (const rect of state.rects) {
    if (random() < rect.flicker) continue
    const x = Math.round(rect.x)
    const left = Math.max(0, x)
    const right = Math.min(buffer.width, x + rect.width)
    const height = Math.min(rect.height, buffer.height - rect.y)
    if (right <= left || height <= 0) continue
    buffer.fillRect(left, rect.y, right - left, height, rect.color)
  }
}
