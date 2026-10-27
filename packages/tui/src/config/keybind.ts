export * as TuiKeybind from "./keybind"

import type { KeyEvent, Renderable } from "@opentui/core"
import type { Binding } from "@opentui/keymap"
import type { BindingConfig, BindingDefaults } from "@opentui/keymap/extras"
import { Schema } from "effect"

const KeyStroke = Schema.Struct({
  name: Schema.String,
  ctrl: Schema.optional(Schema.Boolean),
  shift: Schema.optional(Schema.Boolean),
  meta: Schema.optional(Schema.Boolean),
  super: Schema.optional(Schema.Boolean),
  hyper: Schema.optional(Schema.Boolean),
})

const BindingObject = Schema.StructWithRest(
  Schema.Struct({
    key: Schema.Union([Schema.String, KeyStroke]),
    event: Schema.optional(Schema.Literals(["press", "release"])),
    preventDefault: Schema.optional(Schema.Boolean),
    fallthrough: Schema.optional(Schema.Boolean),
  }),
  [Schema.Record(Schema.String, Schema.Unknown)],
)

const BindingItem = Schema.Union([Schema.String, KeyStroke, BindingObject])
export const BindingValueSchema = Schema.Union([
  Schema.Literal(false),
  Schema.Literal("none"),
  BindingItem,
  Schema.Array(BindingItem),
]).annotate({ identifier: "TuiKeybind.BindingValue" })
export type BindingValueSchema = Schema.Schema.Type<typeof BindingValueSchema>

type Definition = {
  default: BindingValueSchema
  description: string
}

export const LeaderDefault = "ctrl+x"

const keybind = (value: Definition["default"], description: string): Definition => ({ default: value, description })

export const Definitions = {
  leader: keybind(LeaderDefault, "Leader key for keybind combinations"),

  "app.exit": keybind("ctrl+c,ctrl+d,<leader>q", "Exit the application"),
  "app.clear": keybind("ctrl+l", "Clear the screen in mini"),
  "app.debug": keybind("none", "Mostrar u ocultar depuración"),
  "app.console": keybind("none", "Mostrar u ocultar consola"),
  "app.scrap": keybind("none", "Open scrap screen"),
  "app.toggle.animations": keybind("none", "Toggle animations"),
  "app.toggle.file_context": keybind("none", "Toggle file context"),
  "app.toggle.diffwrap": keybind("none", "Toggle diff wrapping"),
  "app.toggle.paste_summary": keybind("none", "Toggle paste summary"),
  "command.palette.show": keybind("ctrl+p", "List available commands"),
  "help.show": keybind("none", "Open help dialog"),
  "docs.open": keybind("none", "Open documentation"),
  "opencode.settings": keybind("none", "Abrir configuración"),
  "server.pair": keybind("none", "Vincular dispositivo"),
  "service.restart": keybind("none", "Reiniciar servicio"),
  "location.reload": keybind("none", "Recargar configuración"),
  "diff.open": keybind("none", "Abrir visor de diferencias"),
  "diff.close": keybind("escape,q", "Cerrar visor de diferencias"),
  "diff.down": keybind("j,down", "Bajar en el visor de diferencias"),
  "diff.up": keybind("k,up", "Subir en el visor de diferencias"),
  "diff.page.down": keybind("pagedown,ctrl+f", "Bajar una página en las diferencias"),
  "diff.page.up": keybind("pageup,ctrl+b", "Subir una página en las diferencias"),
  "diff.half_page.down": keybind("ctrl+d", "Scroll diff viewer down half a page"),
  "diff.half_page.up": keybind("ctrl+u", "Scroll diff viewer up half a page"),
  "diff.first": keybind("gg,home", "Ir al inicio de las diferencias"),
  "diff.last": keybind("shift+g,end", "Ir al final de las diferencias"),
  // Retain shipped configuration names without registering the removed tree navigation commands.
  "diff.toggle": keybind("none", "Deprecated: file tree is mouse-controlled"),
  "diff.expand": keybind("none", "Deprecated: file tree is mouse-controlled"),
  "diff.expand_all": keybind("none", "Deprecated: file tree is mouse-controlled"),
  "diff.collapse": keybind("none", "Deprecated: file tree is mouse-controlled"),
  "diff.switch_focus": keybind("none", "Deprecated: keyboard navigation always controls the diff"),
  "diff.next_hunk": keybind("]", "Ir al bloque de diferencias siguiente"),
  "diff.previous_hunk": keybind("[", "Ir al bloque de diferencias anterior"),
  "diff.next_file": keybind("n,alt+down", "Ir al archivo de diferencias siguiente"),
  "diff.previous_file": keybind("p,alt+up", "Ir al archivo de diferencias anterior"),
  "diff.toggle_file_tree": keybind("b", "Mostrar u ocultar árbol de diferencias"),
  "diff.single_patch": keybind("s", "Alternar vista de un solo archivo"),
  "diff.switch_source": keybind("d", "Cambiar origen de las diferencias"),
  "diff.toggle_view": keybind("v", "Alternar diferencias divididas o unificadas"),
  "diff.toggle_fullscreen": keybind("f", "Alternar diferencias a pantalla completa"),
  "diff.mark_reviewed": keybind("m", "Marcar o desmarcar archivo como revisado"),
  "diff.help": keybind("?,shift+?,shift+/", "Mostrar más atajos de diferencias"),

  "prompt.editor": keybind("<leader>e", "Open external editor"),
  "theme.switch": keybind("none", "List available themes"),
  "theme.switch_mode": keybind("none", "Alternar tema claro y oscuro"),
  "theme.mode.lock": keybind("none", "Bloquear o desbloquear modo del tema"),
  "session.sidebar.toggle": keybind("<leader>b", "Mostrar u ocultar panel lateral"),
  "pane.focus.left": keybind("<leader>left", "Enfocar panel de sesión"),
  "pane.focus.right": keybind("<leader>right", "Enfocar panel derecho"),
  "terminal.select": keybind("<leader>down", "Seleccionar terminal"),
  "terminal.toggle": keybind("<leader>t", "Mostrar u ocultar panel de terminal"),
  "terminal.close": keybind("<leader>up", "Cerrar panel de terminal"),
  "session.toggle.scrollbar": keybind("none", "Mostrar u ocultar barra de desplazamiento"),
  "opencode.status": keybind("<leader>s", "Ver estado"),
  "opencode.debug": keybind("none", "Ver información de depuración"),

  "session.export": keybind("<leader>x", "Exportar sesión al editor"),
  "session.copy": keybind("none", "Copiar conversación"),
  "session.copy.id": keybind("none", "Copiar ID de sesión"),
  "session.move": keybind("none", "Administrar espacios de trabajo"),
  "session.new": keybind("<leader>n", "Crear una sesión"),
  "session.list": keybind("<leader>l", "Listar todas las sesiones"),
  "open.menu": keybind("ctrl+o", "Abrir sesiones y proyectos recientes"),
  "session.tab.next": keybind("ctrl+tab,alt+down", "Ir a la pestaña de sesión siguiente"),
  "session.tab.previous": keybind("ctrl+shift+tab,alt+up", "Ir a la pestaña de sesión anterior"),
  "session.tab.history.back": keybind("none", "Retroceder en el historial de pestañas"),
  "session.tab.history.forward": keybind("ctrl+i", "Avanzar en el historial de pestañas"),
  "session.tab.next_unread": keybind("alt+shift+down", "Ir a la pestaña sin leer siguiente"),
  "session.tab.previous_unread": keybind("alt+shift+up", "Ir a la pestaña sin leer anterior"),
  "session.tab.close": keybind("<leader>w", "Cerrar pestaña de sesión actual"),
  "session.tab.reopen": keybind("ctrl+shift+t", "Reabrir última pestaña de sesión cerrada"),
  "session.timeline": keybind("<leader>g", "Mostrar cronología de la sesión"),
  "session.fork": keybind("none", "Bifurcar sesión desde un mensaje"),
  "session.rename": keybind("ctrl+r", "Cambiar nombre de la sesión"),
  "session.delete": keybind("ctrl+d", "Eliminar sesión"),
  // Retain shipped configuration names; session sharing was removed.
  "session.share": keybind("none", "Obsoleto: ya no se pueden compartir sesiones"),
  "session.unshare": keybind("none", "Obsoleto: ya no se pueden compartir sesiones"),
  "session.interrupt": keybind("escape", "Interrumpir sesión actual"),
  "session.background": keybind("ctrl+b", "Enviar herramientas bloqueantes al segundo plano"),
  "session.compact": keybind("<leader>c", "Compactar la sesión"),
  "session.aside": keybind("none", "Hacer una pregunta aparte"),
  "session.cd": keybind("none", "Cambiar directorio de trabajo"),
  "session.queued_prompts": keybind("<leader>q", "Administrar mensajes en cola"),
  "queued_prompt.undo": keybind("ctrl+u", "Deshacer mensaje en cola"),
  "queued_prompt.delete": keybind("ctrl+d", "Eliminar mensaje en cola"),
  "session.toggle.exploration_grouping": keybind("none", "Alternar agrupación de herramientas relacionadas"),
  "session.verbosity.cycle": keybind("none", "Cambiar detalle de la conversación"),
  "session.child.first": keybind("down", "Mostrar u ocultar selector de subagentes"),
  "session.child.next": keybind("right", "Ir a la sesión hija siguiente"),
  "session.child.previous": keybind("left", "Ir a la sesión hija anterior"),
  "session.parent": keybind("up", "Ir a la sesión principal"),
  "session.pin.toggle": keybind("ctrl+f", "Fijar o desfijar sesión en la lista"),
  "session.quick_switch.1": keybind("<leader>1", "Cambiar a la sesión del acceso rápido 1"),
  "session.quick_switch.2": keybind("<leader>2", "Cambiar a la sesión del acceso rápido 2"),
  "session.quick_switch.3": keybind("<leader>3", "Cambiar a la sesión del acceso rápido 3"),
  "session.quick_switch.4": keybind("<leader>4", "Cambiar a la sesión del acceso rápido 4"),
  "session.quick_switch.5": keybind("<leader>5", "Cambiar a la sesión del acceso rápido 5"),
  "session.quick_switch.6": keybind("<leader>6", "Cambiar a la sesión del acceso rápido 6"),
  "session.quick_switch.7": keybind("<leader>7", "Cambiar a la sesión del acceso rápido 7"),
  "session.quick_switch.8": keybind("<leader>8", "Cambiar a la sesión del acceso rápido 8"),
  "session.quick_switch.9": keybind("<leader>9", "Cambiar a la sesión del acceso rápido 9"),
  "session.tab.select.1": keybind("<leader>1,ctrl+1", "Cambiar a la pestaña de sesión 1"),
  "session.tab.select.2": keybind("<leader>2,ctrl+2", "Cambiar a la pestaña de sesión 2"),
  "session.tab.select.3": keybind("<leader>3,ctrl+3", "Cambiar a la pestaña de sesión 3"),
  "session.tab.select.4": keybind("<leader>4,ctrl+4", "Cambiar a la pestaña de sesión 4"),
  "session.tab.select.5": keybind("<leader>5,ctrl+5", "Cambiar a la pestaña de sesión 5"),
  "session.tab.select.6": keybind("<leader>6,ctrl+6", "Cambiar a la pestaña de sesión 6"),
  "session.tab.select.7": keybind("<leader>7,ctrl+7", "Cambiar a la pestaña de sesión 7"),
  "session.tab.select.8": keybind("<leader>8,ctrl+8", "Cambiar a la pestaña de sesión 8"),
  "session.tab.select.9": keybind("<leader>9,ctrl+9", "Cambiar a la pestaña de sesión 9"),
  "session.tab.select.10": keybind("<leader>0,ctrl+0", "Cambiar a la pestaña de sesión 10"),

  "stash.delete": keybind("ctrl+d", "Eliminar mensaje guardado"),
  "model.dialog.provider": keybind("ctrl+a", "Abrir proveedores desde el selector de modelos"),
  "model.dialog.favorite": keybind("ctrl+f", "Marcar o desmarcar modelo favorito"),
  "model.list": keybind("<leader>m", "Listar modelos disponibles"),
  "model.cycle_recent": keybind("f2", "Modelo reciente siguiente"),
  "model.cycle_recent_reverse": keybind("shift+f2", "Modelo reciente anterior"),
  "model.cycle_favorite": keybind("none", "Modelo favorito siguiente"),
  "model.cycle_favorite_reverse": keybind("none", "Modelo favorito anterior"),
  "mcp.list": keybind("none", "Listar servidores MCP"),
  "provider.connect": keybind("none", "Conectar integración"),
  "agent.list": keybind("<leader>a", "Listar agentes"),
  "agent.cycle": keybind("none", "Agente siguiente"),
  "agent.cycle.reverse": keybind("none", "Agente anterior"),
  "variant.cycle": keybind("ctrl+t", "Cambiar variante del modelo"),
  "variant.list": keybind("none", "Listar variantes del modelo"),

  "session.page.up": keybind("pageup,ctrl+alt+b", "Subir una página en la conversación"),
  "session.page.down": keybind("pagedown,ctrl+alt+f", "Bajar una página en la conversación"),
  "session.line.up": keybind("ctrl+alt+y", "Subir una línea en la conversación"),
  "session.line.down": keybind("ctrl+alt+e", "Bajar una línea en la conversación"),
  "session.half.page.up": keybind("ctrl+alt+u", "Subir media página en la conversación"),
  "session.half.page.down": keybind("ctrl+alt+d", "Bajar media página en la conversación"),
  "session.first": keybind("ctrl+g,home,alt+home", "Ir al primer mensaje"),
  "session.last": keybind("ctrl+alt+g,end", "Ir al último mensaje"),
  "session.message.next": keybind("none", "Ir al siguiente mensaje"),
  "session.message.previous": keybind("none", "Ir al anterior mensaje"),
  "session.message.user.next": keybind("none", "Ir al siguiente mensaje del usuario"),
  "session.message.user.previous": keybind("none", "Ir al anterior mensaje del usuario"),
  "session.messages_last_user": keybind("alt+end", "Ir al último mensaje del usuario"),
  "messages.copy": keybind("<leader>y", "Copiar mensaje"),
  "session.undo": keybind("<leader>u", "Deshacer mensaje"),
  "session.redo": keybind("<leader>r", "Rehacer mensaje"),
  "session.toggle.thinking": keybind("none", "Mostrar u ocultar razonamiento"),

  "prompt.submit": keybind("none", "Enviar mensaje"),
  "prompt.queue": keybind("<leader>return", "Poner mensaje en cola"),
  "prompt.editor_context.clear": keybind("none", "Limpiar contexto del editor"),
  "prompt.images.view": keybind("<leader>i", "Ver imágenes adjuntas"),
  "prompt.skills": keybind("none", "Abrir selector de habilidades"),
  "prompt.stash": keybind("none", "Guardar mensaje para después"),
  "prompt.stash.pop": keybind("none", "Recuperar mensaje guardado"),
  "prompt.stash.list": keybind("none", "Listar mensajes guardados"),

  "prompt.clear": keybind("ctrl+c", "Limpiar campo de entrada"),
  "prompt.paste": keybind({ key: "ctrl+v", preventDefault: false }, "Pegar desde el portapapeles"),
  "input.submit": keybind("return", "Enviar entrada"),
  "input.newline": keybind("shift+return,ctrl+return,alt+return,ctrl+j", "Insertar salto de línea"),
  "input.move.left": keybind("left,ctrl+b", "Mover cursor a la izquierda en la entrada"),
  "input.move.right": keybind("right,ctrl+f", "Mover cursor a la derecha en la entrada"),
  "input.move.up": keybind("up", "Mover cursor hacia arriba en la entrada"),
  "input.move.down": keybind("down", "Mover cursor hacia abajo en la entrada"),
  "input.select.left": keybind("shift+left", "Seleccionar a la izquierda en la entrada"),
  "input.select.right": keybind("shift+right", "Seleccionar a la derecha en la entrada"),
  "input.select.up": keybind("shift+up", "Seleccionar hacia arriba en la entrada"),
  "input.select.down": keybind("shift+down", "Seleccionar hacia abajo en la entrada"),
  "input.line.home": keybind("ctrl+a", "Ir al inicio de la línea"),
  "input.line.end": keybind("ctrl+e", "Ir al final de la línea"),
  "input.select.line.home": keybind("ctrl+shift+a", "Seleccionar hasta el inicio de la línea"),
  "input.select.line.end": keybind("ctrl+shift+e", "Seleccionar hasta el final de la línea"),
  "input.visual.line.home": keybind("alt+a", "Ir al inicio de la línea visual"),
  "input.visual.line.end": keybind("alt+e", "Ir al final de la línea visual"),
  "input.select.visual.line.home": keybind("alt+shift+a", "Seleccionar hasta el inicio de la línea visual"),
  "input.select.visual.line.end": keybind("alt+shift+e", "Seleccionar hasta el final de la línea visual"),
  "input.buffer.home": keybind("none", "Ir al inicio de la entrada"),
  "input.buffer.end": keybind("none", "Ir al final de la entrada"),
  "input.select.buffer.home": keybind("shift+home", "Seleccionar hasta el inicio de la entrada"),
  "input.select.buffer.end": keybind("shift+end", "Seleccionar hasta el final de la entrada"),
  "input.delete.line": keybind("ctrl+shift+d", "Borrar línea de entrada"),
  "input.delete.to.line.end": keybind("ctrl+k", "Borrar hasta el final de la línea"),
  "input.delete.to.line.start": keybind("ctrl+u", "Borrar hasta el inicio de la línea"),
  "input.backspace": keybind("backspace,shift+backspace", "Borrar hacia atrás en la entrada"),
  "input.delete": keybind("ctrl+d,delete,shift+delete", "Borrar carácter de entrada"),
  "input.undo": keybind("ctrl+-,super+z", "Deshacer en la entrada"),
  "input.redo": keybind("ctrl+.,super+shift+z", "Rehacer en la entrada"),
  "input.word.forward": keybind("alt+f,alt+right,ctrl+right", "Ir a la palabra siguiente"),
  "input.word.backward": keybind("alt+b,alt+left,ctrl+left", "Ir a la palabra anterior"),
  "input.select.word.forward": keybind("alt+shift+f,alt+shift+right", "Seleccionar palabra siguiente"),
  "input.select.word.backward": keybind("alt+shift+b,alt+shift+left", "Seleccionar palabra anterior"),
  "input.delete.word.forward": keybind("alt+d,alt+delete,ctrl+delete", "Borrar palabra siguiente"),
  "input.delete.word.backward": keybind("ctrl+w,ctrl+backspace,alt+backspace", "Borrar palabra anterior"),
  "input.select.all": keybind("super+a", "Seleccionar toda la entrada"),
  "prompt.history.previous": keybind("up", "Elemento anterior del historial"),
  "prompt.history.next": keybind("down", "Elemento siguiente del historial"),

  "composer.subagent.up": keybind("up", "Subagente anterior"),
  "composer.subagent.down": keybind("down", "Subagente siguiente"),
  "composer.subagent.select": keybind("return", "Ir al subagente"),
  "composer.subagent.interrupt": keybind("ctrl+d", "Interrumpir subagente"),
  "composer.shell.up": keybind("up", "Comando de terminal anterior"),
  "composer.shell.down": keybind("down", "Comando de terminal siguiente"),
  "composer.shell.select": keybind("return", "Ver salida de la terminal"),
  "composer.shell.kill": keybind("ctrl+d", "Detener comando de terminal"),
  "composer.terminal.up": keybind("up,k", "Terminal anterior"),
  "composer.terminal.down": keybind("down,j", "Terminal siguiente"),
  "composer.terminal.select": keybind("return", "Seleccionar terminal"),

  "dialog.select.prev": keybind("up,ctrl+p", "Ir al anterior elemento del diálogo"),
  "dialog.select.next": keybind("down,ctrl+n", "Ir al siguiente elemento del diálogo"),
  "dialog.select.page_up": keybind("pageup", "Subir una página en el diálogo"),
  "dialog.select.page_down": keybind("pagedown", "Bajar una página en el diálogo"),
  "dialog.select.home": keybind("home", "Ir al primer elemento del diálogo"),
  "dialog.select.end": keybind("end", "Ir al último elemento del diálogo"),
  "dialog.select.submit": keybind("return", "Confirmar elemento seleccionado"),
  "dialog.prompt.submit": keybind("return", "Enviar texto del diálogo"),
  "dialog.integration.rename": keybind("ctrl+r", "Cambiar nombre de cuenta de integración"),
  "dialog.integration.delete": keybind("ctrl+d", "Eliminar cuenta de integración"),
  "dialog.worktree.generate": keybind("tab", "Generar nombre del árbol de trabajo"),
  "dialog.move_session.new": keybind("ctrl+a", "Nuevo árbol de trabajo"),
  "dialog.move_session.move": keybind("ctrl+m", "Mover sesión al árbol de trabajo"),
  "dialog.move_session.delete": keybind("ctrl+d", "Eliminar árbol de trabajo"),
  "dialog.move_session.refresh": keybind("ctrl+r", "Actualizar árboles de trabajo"),
  "prompt.autocomplete.prev": keybind("up,ctrl+p", "Ir a la sugerencia anterior"),
  "prompt.autocomplete.next": keybind("down,ctrl+n", "Ir a la sugerencia siguiente"),
  "prompt.autocomplete.hide": keybind("escape", "Ocultar sugerencias"),
  "prompt.autocomplete.select": keybind("return", "Seleccionar sugerencia"),
  "prompt.autocomplete.complete": keybind("tab", "Completar sugerencia"),
  "permission.prompt.fullscreen": keybind("ctrl+f", "Alternar solicitud de permiso a pantalla completa"),
  "plugins.toggle": keybind("return", "Activar o desactivar complemento"),
  "dialog.mcp.toggle": keybind("space", "Activar o desactivar servidor MCP"),
  "dialog.plugins.error": keybind("space", "Ver error del complemento"),
  "dialog.plugins.update": keybind("ctrl+u", "Actualizar complemento desde su diálogo"),
  "dialog.plugins.check": keybind("ctrl+r", "Buscar actualizaciones desde el diálogo de complementos"),

  "terminal.suspend": keybind("ctrl+z", "Suspender terminal"),
  "terminal.title.toggle": keybind("none", "Activar o desactivar título de terminal"),
  "plugins.list": keybind("none", "Abrir administrador de complementos"),

  "which-key.toggle": keybind("ctrl+alt+k", "Mostrar u ocultar ayuda de atajos"),
  "which-key.layout.toggle": keybind("ctrl+alt+shift+k", "Cambiar distribución de ayuda de atajos"),
  "which-key.pending.toggle": keybind("ctrl+alt+shift+p", "Alternar vista previa de atajo pendiente"),
  "which-key.group.previous": keybind("ctrl+alt+left,ctrl+alt+[", "Grupo anterior de atajos"),
  "which-key.group.next": keybind("ctrl+alt+right,ctrl+alt+]", "Grupo siguiente de atajos"),
  "which-key.scroll.up": keybind("ctrl+alt+up,ctrl+alt+p", "Subir en la ayuda de atajos"),
  "which-key.scroll.down": keybind("ctrl+alt+down,ctrl+alt+n", "Bajar en la ayuda de atajos"),
  "which-key.page.up": keybind("ctrl+alt+pageup", "Subir página de atajos"),
  "which-key.page.down": keybind("ctrl+alt+pagedown", "Bajar página de atajos"),
  "which-key.home": keybind("ctrl+alt+home", "Ir al primer atajo"),
  "which-key.end": keybind("ctrl+alt+end", "Ir al último atajo"),
} satisfies Record<string, Definition>

type KeybindName = keyof typeof Definitions
const KeybindNames = new Set<string>(Object.keys(Definitions))

export const KeybindOverrides = Schema.Struct(
  Object.fromEntries(
    Object.entries(Definitions).map(([name, item]) => [
      name,
      Schema.optional(BindingValueSchema).annotate({ description: item.description }),
    ]),
  ),
).annotate({ description: "Atajos personalizados de la terminal" })
export const Descriptions = Object.fromEntries(
  Object.entries(Definitions).map(([name, item]) => [name, item.description]),
) as Record<KeybindName, string>

export type Keybinds = { [K in KeybindName]: BindingValueSchema }
export type KeybindOverrides = Partial<Keybinds>
export type BindingLookupView = {
  readonly bindings: readonly Binding<Renderable, KeyEvent>[]
  get(command: string): readonly Binding<Renderable, KeyEvent>[]
  has(command: string): boolean
  gather(name: string, commands: readonly string[]): readonly Binding<Renderable, KeyEvent>[]
  pick(name: string, commands: readonly string[]): Binding<Renderable, KeyEvent>[]
  omit(name: string, commands: readonly string[]): Binding<Renderable, KeyEvent>[]
}

export function toBindingConfig(keybinds: Keybinds): BindingConfig<Renderable, KeyEvent> {
  return Object.fromEntries(Object.entries(keybinds)) as BindingConfig<Renderable, KeyEvent>
}

const decodeBindingValue = Schema.decodeUnknownSync(BindingValueSchema)

export function defaultValue(name: KeybindName) {
  return Definitions[name].default
}

export function parse(keybinds: KeybindOverrides): Keybinds {
  const invalid = unknownKeys(keybinds)
  if (invalid.length) throw new Error(`Unrecognized keybind${invalid.length === 1 ? "" : "s"}: ${invalid.join(", ")}`)
  return Object.fromEntries(
    Object.entries(Definitions).map(([name, item]) => [
      name,
      decodeBindingValue(keybinds[name as KeybindName] ?? item.default),
    ]),
  ) as Keybinds
}

export function unknownKeys(input: object) {
  return Object.keys(input).filter((key) => !KeybindNames.has(key))
}

export function bindingDefaults(): BindingDefaults<Renderable, KeyEvent> {
  return ({ command, binding }) => {
    if (binding.desc !== undefined) return
    return { desc: Descriptions[command as KeybindName] }
  }
}
