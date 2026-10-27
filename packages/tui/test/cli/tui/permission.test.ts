import { expect, test } from "bun:test"
import { permissionSemanticLabel } from "../../../src/routes/session/permission"

test("uses the permission action when a surface has no display title", () => {
  expect(permissionSemanticLabel("shell")).toBe("Se requiere permiso: shell")
  expect(permissionSemanticLabel("edit", "Editar fixture.txt")).toBe("Se requiere permiso: Edit fixture.txt")
})
