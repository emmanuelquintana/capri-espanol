import { expect, test } from "bun:test"
import type { FormField, FormValue } from "@opencode/client"
import {
  formCustom,
  formDisplayValue,
  formInitialValues,
  formLabel,
  formRows,
  formSelected,
  formSetMultiselectCustom,
  formTextual,
  formToggleMultiselect,
  formValidateValue,
  isFormAnswerField,
} from "../../src/util/form"
import type { FormAnswerField } from "../../src/util/form"

const option = {
  key: "choice",
  type: "string",
  options: [{ value: "one", label: "One" }],
  custom: true,
} satisfies FormField
const selection = {
  key: "tags",
  type: "multiselect",
  options: [
    { value: "one", label: "One" },
    { value: "two", label: "Two" },
  ],
  custom: true,
} satisfies FormAnswerField

test("initializes configured and custom defaults", () => {
  expect(
    formInitialValues([
      { key: "mode", type: "string", options: [{ value: "fast", label: "Fast" }], default: "fast" },
      { ...option, key: "note", default: "detailed" },
      { ...option, key: "configured", default: "one" },
      { key: "count", type: "number", default: 0 },
      { key: "authorize", type: "external", url: "https://example.com" },
    ]),
  ).toEqual({
    answers: { mode: "fast", note: "detailed", configured: "one", count: 0 },
    custom: { note: "detailed" },
  })
})

test("validates every supported field constraint", () => {
  const validate = (field: FormAnswerField, value: FormValue | undefined, error: string | undefined) =>
    expect(formValidateValue(field, value)).toBe(error)
  const string = (extra: Partial<Extract<FormAnswerField, { type: "string" }>> = {}) =>
    ({ key: "value", type: "string", ...extra }) satisfies FormAnswerField
  const multi = (extra: Partial<Extract<FormAnswerField, { type: "multiselect" }>> = {}) =>
    ({ key: "value", type: "multiselect", options: [], ...extra }) satisfies FormAnswerField

  validate(string({ required: true }), undefined, "Falta respuesta")
  validate(multi({ required: true }), [], "Selecciona al menos una opción")
  validate(string(), true, "Se esperaba texto")
  validate(string({ minLength: 3 }), "ab", "El mínimo es 3 caracteres")
  validate(string({ maxLength: 2 }), "abc", "El máximo es 2 caracteres")
  validate(string({ pattern: "^a+$" }), "bbb", "Debe coincidir con el patrón: ^a+$")
  validate(string({ pattern: "[" }), "value", "Patrón no válido: [")
  validate(string({ format: "email" }), "invalid", "Introduce un correo electrónico")
  validate(string({ format: "uri" }), "not a URL", "Introduce una URL")
  validate(string({ format: "date" }), "2025-02-29", "Introduce una fecha (AAAA-MM-DD)")
  validate(string({ format: "date-time" }), "not a date", "Introduce una fecha y hora")
  validate(string({ options: [{ value: "yes", label: "Yes" }] }), "no", "Selecciona una opción disponible")
  validate({ key: "value", type: "number" }, Number.NaN, "Introduce un número")
  validate({ key: "value", type: "integer" }, 1.5, "Introduce un número entero")
  validate({ key: "value", type: "number", minimum: 2 }, 1, "El mínimo es 2")
  validate({ key: "value", type: "number", maximum: 2 }, 3, "El máximo es 2")
  validate({ key: "value", type: "boolean" }, "yes", "Se esperaba sí o no")
  validate(multi(), "yes", "Selecciona las opciones")
  validate(multi({ minItems: 2 }), ["one"], "Selecciona al menos 2")
  validate(multi({ maxItems: 1 }), ["one", "two"], "Selecciona como máximo 1")
  validate(multi({ options: [{ value: "one", label: "One" }] }), ["two"], "Selecciona solo opciones disponibles")
  validate(multi({ custom: true }), ["custom"], undefined)
})

test("shares field classification, rows, selection, and display", () => {
  const text = { key: "name", type: "string", title: "Name" } satisfies FormField
  const external = { key: "authorize", type: "external", url: "https://example.com" } satisfies FormField
  expect([isFormAnswerField(text), isFormAnswerField(external)]).toEqual([true, false])
  expect([formLabel(text), formLabel(external)]).toEqual(["Name", "https://example.com"])
  expect([formTextual(text), formTextual(option), formCustom(option)]).toEqual([true, false, true])
  expect(formRows({ key: "value", type: "boolean" })).toEqual([
    { value: true, label: "Sí" },
    { value: false, label: "No" },
  ])
  expect(formRows({ ...option, options: [{ value: "one", label: "One", description: "First" }] })).toEqual([
    { value: "one", label: "One", description: "First" },
  ])
  expect(formRows({ key: "value", type: "number" })).toEqual([])
  expect([
    formSelected(selection, "two"),
    formSelected(selection, "custom"),
    formSelected(selection, undefined),
  ]).toEqual([1, 2, 0])
  expect(formDisplayValue(selection, ["one", "custom"], "(none)")).toBe("One, custom")
  expect([formDisplayValue(selection, [], ""), formDisplayValue(selection, [], "(none)")]).toEqual(["", "(none)"])
})

test("updates multiselects without mutating their source", () => {
  const source = ["one", "custom"]
  expect(formToggleMultiselect(source, "one")).toEqual(["custom"])
  expect(formToggleMultiselect(source, "two")).toEqual(["one", "custom", "two"])
  expect(formSetMultiselectCustom(source, "custom", "replacement")).toEqual(["one", "replacement"])
  expect(source).toEqual(["one", "custom"])
})
