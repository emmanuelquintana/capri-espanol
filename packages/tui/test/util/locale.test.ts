import { expect, test } from "bun:test"
import { Locale } from "../../src/util/locale"

test("capitalizes Spanish accents without splitting Unicode words", () => {
  expect(Locale.titlecase("árbol de archivos")).toBe("Árbol De Archivos")
  expect(Locale.titlecase("sesión próxima")).toBe("Sesión Próxima")
})

test("formats dates in Spanish independently of the operating system language", () => {
  const date = new Date(2026, 9, 26, 13, 5)
  expect(Locale.time(date.getTime())).toBe(date.toLocaleTimeString("es-MX", { timeStyle: "short" }))
  expect(Locale.datetime(date.getTime())).toContain(date.toLocaleDateString("es-MX"))
})

test("truncates text from the right by terminal width", () => {
  expect(Locale.truncateWidth("abcdefgh", 5)).toBe("abcd…")
  expect(Locale.truncateWidth("ab界cd", 5)).toBe("ab界…")
  expect(Locale.truncateWidth("abcdefgh", 1)).toBe("…")
  expect(Locale.truncateWidth("abcdefgh", 0)).toBe("")
})

test("takes whole graphemes within terminal width", () => {
  expect(Locale.takeWidth("ab界cd", 4)).toBe("ab界")
  expect(Locale.graphemes("a👨‍👩‍👧‍👦b")).toEqual(["a", "👨‍👩‍👧‍👦", "b"])
})

test("rolls the compact form over at the rounding boundary", () => {
  expect(Locale.number(999949)).toBe("999.9K")
  expect(Locale.number(999950)).toBe("1.0M")
  expect(Locale.number(1000000)).toBe("1.0M")
})
