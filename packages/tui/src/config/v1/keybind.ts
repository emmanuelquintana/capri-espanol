export * as TuiKeybind from "./keybind"

import type { KeyEvent, Renderable } from "@opentui/core"
import type { Binding } from "@opentui/keymap"
import type { BindingCommandMap, BindingConfig, BindingDefaults } from "@opentui/keymap/extras"
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
])
export type BindingValueSchema = Schema.Schema.Type<typeof BindingValueSchema>

type Definition = {
  default: BindingValueSchema
  description: string
}

export const LeaderDefault = "ctrl+x"

const keybind = (value: Definition["default"], description: string): Definition => ({ default: value, description })

export const Definitions = {
  leader: keybind(LeaderDefault, "Leader key for keybind combinations"),

  app_exit: keybind("ctrl+c,ctrl+d,<leader>q", "Exit the application"),
  app_debug: keybind("none", "Mostrar u ocultar depuración"),
  app_console: keybind("none", "Mostrar u ocultar consola"),
  app_heap_snapshot: keybind("none", "Guardar captura de memoria"),
  app_toggle_animations: keybind("none", "Toggle animations"),
  app_toggle_file_context: keybind("none", "Toggle file context"),
  app_toggle_diffwrap: keybind("none", "Toggle diff wrapping"),
  app_toggle_paste_summary: keybind("none", "Toggle paste summary"),
  command_list: keybind("ctrl+p", "List available commands"),
  help_show: keybind("none", "Open help dialog"),
  docs_open: keybind("none", "Open documentation"),
  diff_open: keybind("none", "Abrir visor de diferencias"),
  diff_close: keybind("escape,q", "Cerrar visor de diferencias"),
  diff_toggle: keybind("enter,space", "Toggle diff viewer item"),
  diff_expand: keybind("right", "Expand diff viewer item"),
  diff_expand_all: keybind("E", "Expand all diff viewer folders"),
  diff_collapse: keybind("left", "Collapse diff viewer item"),
  diff_switch_focus: keybind("tab", "Switch diff viewer focus"),
  diff_next_hunk: keybind("]", "Ir al bloque de diferencias siguiente"),
  diff_previous_hunk: keybind("[", "Ir al bloque de diferencias anterior"),
  diff_next_file: keybind("n", "Ir al archivo de diferencias siguiente"),
  diff_previous_file: keybind("p", "Ir al archivo de diferencias anterior"),
  diff_toggle_file_tree: keybind("b", "Mostrar u ocultar árbol de diferencias"),
  diff_single_patch: keybind("s", "Alternar vista de un solo archivo"),
  diff_switch_source: keybind("d", "Cambiar origen de las diferencias"),
  diff_toggle_view: keybind("v", "Alternar diferencias divididas o unificadas"),
  diff_help: keybind("?", "Mostrar más atajos de diferencias"),

  editor_open: keybind("<leader>e", "Open external editor"),
  theme_list: keybind("<leader>t", "List available themes"),
  theme_switch_mode: keybind("none", "Alternar tema claro y oscuro"),
  theme_mode_lock: keybind("none", "Bloquear o desbloquear modo del tema"),
  sidebar_toggle: keybind("<leader>b", "Mostrar u ocultar panel lateral"),
  scrollbar_toggle: keybind("none", "Mostrar u ocultar barra de desplazamiento"),
  status_view: keybind("<leader>s", "Ver estado"),
  debug_view: keybind("none", "Ver información de depuración"),

  session_export: keybind("<leader>x", "Exportar sesión al editor"),
  session_copy: keybind("none", "Copiar conversación"),
  session_move: keybind("none", "Mover sesión"),
  session_new: keybind("<leader>n", "Crear una sesión"),
  session_list: keybind("<leader>l", "Listar todas las sesiones"),
  open_menu: keybind("ctrl+o", "Abrir sesiones y proyectos recientes"),
  session_tab_next: keybind("ctrl+tab,alt+down", "Ir a la pestaña abierta siguiente"),
  session_tab_previous: keybind("ctrl+shift+tab,alt+up", "Ir a la pestaña abierta anterior"),
  session_tab_next_unread: keybind("alt+shift+down", "Ir a la pestaña sin leer siguiente"),
  session_tab_previous_unread: keybind("alt+shift+up", "Ir a la pestaña sin leer anterior"),
  session_tab_close: keybind("<leader>w", "Cerrar pestaña actual"),
  session_tab_reopen: keybind("ctrl+shift+t", "Reabrir última pestaña cerrada"),
  session_timeline: keybind("<leader>g", "Mostrar cronología de la sesión"),
  session_fork: keybind("none", "Bifurcar sesión desde un mensaje"),
  session_rename: keybind("ctrl+r", "Cambiar nombre de la sesión"),
  session_delete: keybind("ctrl+d", "Eliminar sesión"),
  session_share: keybind("none", "Obsoleto: ya no se pueden compartir sesiones"),
  session_unshare: keybind("none", "Obsoleto: ya no se pueden compartir sesiones"),
  session_interrupt: keybind("escape", "Interrumpir sesión actual"),
  session_background: keybind("ctrl+b", "Enviar herramientas bloqueantes al segundo plano"),
  session_compact: keybind("<leader>c", "Compactar la sesión"),
  session_queued_prompts: keybind("<leader>q", "Ver mensajes en cola"),
  queued_prompt_delete: keybind("ctrl+d", "Eliminar mensaje en cola"),
  session_child_first: keybind("down", "Mostrar u ocultar selector de subagentes"),
  session_parent: keybind("up", "Ir a la sesión principal"),
  session_pin_toggle: keybind("ctrl+f", "Fijar o desfijar sesión en la lista"),
  session_quick_switch_1: keybind("<leader>1", "Cambiar a la sesión del acceso rápido 1"),
  session_quick_switch_2: keybind("<leader>2", "Cambiar a la sesión del acceso rápido 2"),
  session_quick_switch_3: keybind("<leader>3", "Cambiar a la sesión del acceso rápido 3"),
  session_quick_switch_4: keybind("<leader>4", "Cambiar a la sesión del acceso rápido 4"),
  session_quick_switch_5: keybind("<leader>5", "Cambiar a la sesión del acceso rápido 5"),
  session_quick_switch_6: keybind("<leader>6", "Cambiar a la sesión del acceso rápido 6"),
  session_quick_switch_7: keybind("<leader>7", "Cambiar a la sesión del acceso rápido 7"),
  session_quick_switch_8: keybind("<leader>8", "Cambiar a la sesión del acceso rápido 8"),
  session_quick_switch_9: keybind("<leader>9", "Cambiar a la sesión del acceso rápido 9"),
  session_tab_select_1: keybind("<leader>1,ctrl+1", "Cambiar a la pestaña 1"),
  session_tab_select_2: keybind("<leader>2,ctrl+2", "Cambiar a la pestaña 2"),
  session_tab_select_3: keybind("<leader>3,ctrl+3", "Cambiar a la pestaña 3"),
  session_tab_select_4: keybind("<leader>4,ctrl+4", "Cambiar a la pestaña 4"),
  session_tab_select_5: keybind("<leader>5,ctrl+5", "Cambiar a la pestaña 5"),
  session_tab_select_6: keybind("<leader>6,ctrl+6", "Cambiar a la pestaña 6"),
  session_tab_select_7: keybind("<leader>7,ctrl+7", "Cambiar a la pestaña 7"),
  session_tab_select_8: keybind("<leader>8,ctrl+8", "Cambiar a la pestaña 8"),
  session_tab_select_9: keybind("<leader>9,ctrl+9", "Cambiar a la pestaña 9"),
  session_tab_select_10: keybind("<leader>0,ctrl+0", "Cambiar a la pestaña 10"),

  stash_delete: keybind("ctrl+d", "Eliminar mensaje guardado"),
  model_provider_list: keybind("ctrl+a", "Abrir proveedores desde el selector de modelos"),
  model_favorite_toggle: keybind("ctrl+f", "Marcar o desmarcar modelo favorito"),
  model_list: keybind("<leader>m", "Listar modelos disponibles"),
  model_cycle_recent: keybind("f2", "Modelo reciente siguiente"),
  model_cycle_recent_reverse: keybind("shift+f2", "Modelo reciente anterior"),
  model_cycle_favorite: keybind("none", "Modelo favorito siguiente"),
  model_cycle_favorite_reverse: keybind("none", "Modelo favorito anterior"),
  mcp_list: keybind("none", "Listar servidores MCP"),
  provider_connect: keybind("none", "Conectar una integración"),
  agent_list: keybind("<leader>a", "Listar agentes"),
  agent_cycle: keybind("shift+tab", "Agente siguiente"),
  agent_cycle_reverse: keybind("none", "Agente anterior"),
  variant_cycle: keybind("ctrl+t", "Cambiar variante del modelo"),
  variant_list: keybind("none", "Listar variantes del modelo"),

  messages_page_up: keybind("pageup,ctrl+alt+b", "Subir una página en la conversación"),
  messages_page_down: keybind("pagedown,ctrl+alt+f", "Bajar una página en la conversación"),
  messages_line_up: keybind("ctrl+alt+y", "Subir una línea en la conversación"),
  messages_line_down: keybind("ctrl+alt+e", "Bajar una línea en la conversación"),
  messages_half_page_up: keybind("ctrl+alt+u", "Subir media página en la conversación"),
  messages_half_page_down: keybind("ctrl+alt+d", "Bajar media página en la conversación"),
  messages_first: keybind("ctrl+g,home,alt+home", "Ir al primer mensaje"),
  messages_last: keybind("ctrl+alt+g,end", "Ir al último mensaje"),
  messages_next: keybind("none", "Ir al siguiente mensaje"),
  messages_previous: keybind("none", "Ir al anterior mensaje"),
  messages_next_user: keybind("none", "Ir al siguiente mensaje del usuario"),
  messages_previous_user: keybind("none", "Ir al anterior mensaje del usuario"),
  messages_last_user: keybind("alt+end", "Ir al último mensaje del usuario"),
  messages_copy: keybind("<leader>y", "Copiar mensaje"),
  messages_undo: keybind("<leader>u", "Deshacer mensaje"),
  messages_redo: keybind("<leader>r", "Rehacer mensaje"),
  display_thinking: keybind("none", "Mostrar u ocultar razonamiento"),

  prompt_submit: keybind("none", "Enviar mensaje"),
  prompt_queue: keybind("<leader>return", "Poner mensaje en cola"),
  prompt_editor_context_clear: keybind("none", "Limpiar contexto del editor"),
  prompt_images_view: keybind("<leader>i", "Ver imágenes adjuntas"),
  prompt_skills: keybind("none", "Abrir selector de habilidades"),
  prompt_stash: keybind("none", "Guardar mensaje para después"),
  prompt_stash_pop: keybind("none", "Recuperar mensaje guardado"),
  prompt_stash_list: keybind("none", "Listar mensajes guardados"),

  input_clear: keybind("ctrl+c", "Limpiar campo de entrada"),
  input_paste: keybind({ key: "ctrl+v", preventDefault: false }, "Pegar desde el portapapeles"),
  input_submit: keybind("return", "Enviar entrada"),
  input_newline: keybind("shift+return,ctrl+return,alt+return,ctrl+j", "Insertar salto de línea"),
  input_move_left: keybind("left,ctrl+b", "Mover cursor a la izquierda en la entrada"),
  input_move_right: keybind("right,ctrl+f", "Mover cursor a la derecha en la entrada"),
  input_move_up: keybind("up", "Mover cursor hacia arriba en la entrada"),
  input_move_down: keybind("down", "Mover cursor hacia abajo en la entrada"),
  input_select_left: keybind("shift+left", "Seleccionar a la izquierda en la entrada"),
  input_select_right: keybind("shift+right", "Seleccionar a la derecha en la entrada"),
  input_select_up: keybind("shift+up", "Seleccionar hacia arriba en la entrada"),
  input_select_down: keybind("shift+down", "Seleccionar hacia abajo en la entrada"),
  input_line_home: keybind("ctrl+a", "Ir al inicio de la línea"),
  input_line_end: keybind("ctrl+e", "Ir al final de la línea"),
  input_select_line_home: keybind("ctrl+shift+a", "Seleccionar hasta el inicio de la línea"),
  input_select_line_end: keybind("ctrl+shift+e", "Seleccionar hasta el final de la línea"),
  input_visual_line_home: keybind("alt+a", "Ir al inicio de la línea visual"),
  input_visual_line_end: keybind("alt+e", "Ir al final de la línea visual"),
  input_select_visual_line_home: keybind("alt+shift+a", "Seleccionar hasta el inicio de la línea visual"),
  input_select_visual_line_end: keybind("alt+shift+e", "Seleccionar hasta el final de la línea visual"),
  input_buffer_home: keybind("none", "Ir al inicio de la entrada"),
  input_buffer_end: keybind("none", "Ir al final de la entrada"),
  input_select_buffer_home: keybind("shift+home", "Seleccionar hasta el inicio de la entrada"),
  input_select_buffer_end: keybind("shift+end", "Seleccionar hasta el final de la entrada"),
  input_delete_line: keybind("ctrl+shift+d", "Borrar línea de entrada"),
  input_delete_to_line_end: keybind("ctrl+k", "Borrar hasta el final de la línea"),
  input_delete_to_line_start: keybind("ctrl+u", "Borrar hasta el inicio de la línea"),
  input_backspace: keybind("backspace,shift+backspace", "Borrar hacia atrás en la entrada"),
  input_delete: keybind("ctrl+d,delete,shift+delete", "Borrar carácter de entrada"),
  input_undo: keybind("ctrl+-,super+z", "Deshacer en la entrada"),
  input_redo: keybind("ctrl+.,super+shift+z", "Rehacer en la entrada"),
  input_word_forward: keybind("alt+f,alt+right,ctrl+right", "Ir a la palabra siguiente"),
  input_word_backward: keybind("alt+b,alt+left,ctrl+left", "Ir a la palabra anterior"),
  input_select_word_forward: keybind("alt+shift+f,alt+shift+right", "Seleccionar palabra siguiente"),
  input_select_word_backward: keybind("alt+shift+b,alt+shift+left", "Seleccionar palabra anterior"),
  input_delete_word_forward: keybind("alt+d,alt+delete,ctrl+delete", "Borrar palabra siguiente"),
  input_delete_word_backward: keybind("ctrl+w,ctrl+backspace,alt+backspace", "Borrar palabra anterior"),
  input_select_all: keybind("super+a", "Seleccionar toda la entrada"),
  history_previous: keybind("up", "Elemento anterior del historial"),
  history_next: keybind("down", "Elemento siguiente del historial"),

  "dialog.select.prev": keybind("up,ctrl+p", "Ir al anterior elemento del diálogo"),
  "dialog.select.next": keybind("down,ctrl+n", "Ir al siguiente elemento del diálogo"),
  "dialog.select.page_up": keybind("pageup", "Subir una página en el diálogo"),
  "dialog.select.page_down": keybind("pagedown", "Bajar una página en el diálogo"),
  "dialog.select.home": keybind("home", "Ir al primer elemento del diálogo"),
  "dialog.select.end": keybind("end", "Ir al último elemento del diálogo"),
  "dialog.select.submit": keybind("return", "Confirmar elemento seleccionado"),
  "dialog.prompt.submit": keybind("return", "Enviar texto del diálogo"),
  "dialog.project_copy.generate": keybind("tab", "Generar nombre de copia del proyecto"),
  "dialog.move_session.new": keybind("ctrl+m", "Nueva copia del proyecto"),
  "dialog.move_session.delete": keybind("ctrl+d", "Eliminar copia del proyecto"),
  "dialog.move_session.refresh": keybind("ctrl+r", "Actualizar copias del proyecto"),
  "prompt.autocomplete.prev": keybind("up,ctrl+p", "Ir a la sugerencia anterior"),
  "prompt.autocomplete.next": keybind("down,ctrl+n", "Ir a la sugerencia siguiente"),
  "prompt.autocomplete.hide": keybind("escape", "Ocultar sugerencias"),
  "prompt.autocomplete.select": keybind("return", "Seleccionar sugerencia"),
  "prompt.autocomplete.complete": keybind("tab", "Completar sugerencia"),
  "permission.prompt.fullscreen": keybind("ctrl+f", "Alternar solicitud de permiso a pantalla completa"),
  "plugins.toggle": keybind("return", "Activar o desactivar complemento"),
  "dialog.mcp.toggle": keybind("space", "Activar o desactivar servidor MCP"),

  terminal_suspend: keybind("ctrl+z", "Suspender terminal"),
  terminal_title_toggle: keybind("none", "Activar o desactivar título de terminal"),
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
export const CommandMap = {
  app_exit: "app.exit",
  app_debug: "app.debug",
  app_console: "app.console",
  app_heap_snapshot: "app.heap_snapshot",
  app_toggle_animations: "app.toggle.animations",
  app_toggle_file_context: "app.toggle.file_context",
  app_toggle_diffwrap: "app.toggle.diffwrap",
  app_toggle_paste_summary: "app.toggle.paste_summary",
  command_list: "command.palette.show",
  help_show: "help.show",
  docs_open: "docs.open",
  diff_open: "diff.open",
  diff_close: "diff.close",
  diff_toggle: "diff.toggle",
  diff_expand: "diff.expand",
  diff_expand_all: "diff.expand_all",
  diff_collapse: "diff.collapse",
  diff_switch_focus: "diff.switch_focus",
  diff_next_hunk: "diff.next_hunk",
  diff_previous_hunk: "diff.previous_hunk",
  diff_next_file: "diff.next_file",
  diff_previous_file: "diff.previous_file",
  diff_toggle_file_tree: "diff.toggle_file_tree",
  diff_single_patch: "diff.single_patch",
  diff_switch_source: "diff.switch_source",
  diff_toggle_view: "diff.toggle_view",
  diff_help: "diff.help",
  editor_open: "prompt.editor",
  theme_list: "theme.switch",
  theme_switch_mode: "theme.switch_mode",
  theme_mode_lock: "theme.mode.lock",
  sidebar_toggle: "session.sidebar.toggle",
  scrollbar_toggle: "session.toggle.scrollbar",
  status_view: "opencode.status",
  debug_view: "opencode.debug",
  session_export: "session.export",
  session_copy: "session.copy",
  session_move: "session.move",
  session_new: "session.new",
  session_list: "session.list",
  open_menu: "open.menu",
  session_tab_next: "session.tab.next",
  session_tab_previous: "session.tab.previous",
  session_tab_next_unread: "session.tab.next_unread",
  session_tab_previous_unread: "session.tab.previous_unread",
  session_tab_close: "session.tab.close",
  session_tab_reopen: "session.tab.reopen",
  session_timeline: "session.timeline",
  session_fork: "session.fork",
  session_rename: "session.rename",
  session_delete: "session.delete",
  session_share: "session.share",
  session_unshare: "session.unshare",
  session_interrupt: "session.interrupt",
  session_background: "session.background",
  session_compact: "session.compact",
  session_queued_prompts: "session.queued_prompts",
  queued_prompt_delete: "queued_prompt.delete",
  session_child_first: "session.child.first",
  session_parent: "session.parent",
  session_pin_toggle: "session.pin.toggle",
  session_quick_switch_1: "session.quick_switch.1",
  session_quick_switch_2: "session.quick_switch.2",
  session_quick_switch_3: "session.quick_switch.3",
  session_quick_switch_4: "session.quick_switch.4",
  session_quick_switch_5: "session.quick_switch.5",
  session_quick_switch_6: "session.quick_switch.6",
  session_quick_switch_7: "session.quick_switch.7",
  session_quick_switch_8: "session.quick_switch.8",
  session_quick_switch_9: "session.quick_switch.9",
  session_tab_select_1: "session.tab.select.1",
  session_tab_select_2: "session.tab.select.2",
  session_tab_select_3: "session.tab.select.3",
  session_tab_select_4: "session.tab.select.4",
  session_tab_select_5: "session.tab.select.5",
  session_tab_select_6: "session.tab.select.6",
  session_tab_select_7: "session.tab.select.7",
  session_tab_select_8: "session.tab.select.8",
  session_tab_select_9: "session.tab.select.9",
  session_tab_select_10: "session.tab.select.10",
  stash_delete: "stash.delete",
  model_provider_list: "model.dialog.provider",
  model_favorite_toggle: "model.dialog.favorite",
  model_list: "model.list",
  model_cycle_recent: "model.cycle_recent",
  model_cycle_recent_reverse: "model.cycle_recent_reverse",
  model_cycle_favorite: "model.cycle_favorite",
  model_cycle_favorite_reverse: "model.cycle_favorite_reverse",
  mcp_list: "mcp.list",
  provider_connect: "provider.connect",
  agent_list: "agent.list",
  agent_cycle: "agent.cycle",
  agent_cycle_reverse: "agent.cycle.reverse",
  variant_cycle: "variant.cycle",
  variant_list: "variant.list",
  messages_page_up: "session.page.up",
  messages_page_down: "session.page.down",
  messages_line_up: "session.line.up",
  messages_line_down: "session.line.down",
  messages_half_page_up: "session.half.page.up",
  messages_half_page_down: "session.half.page.down",
  messages_first: "session.first",
  messages_last: "session.last",
  messages_next: "session.message.next",
  messages_previous: "session.message.previous",
  messages_next_user: "session.message.user.next",
  messages_previous_user: "session.message.user.previous",
  messages_last_user: "session.messages_last_user",
  messages_copy: "messages.copy",
  messages_undo: "session.undo",
  messages_redo: "session.redo",
  display_thinking: "session.toggle.thinking",
  prompt_submit: "prompt.submit",
  prompt_queue: "prompt.queue",
  prompt_editor_context_clear: "prompt.editor_context.clear",
  prompt_images_view: "prompt.images.view",
  prompt_skills: "prompt.skills",
  prompt_stash: "prompt.stash",
  prompt_stash_pop: "prompt.stash.pop",
  prompt_stash_list: "prompt.stash.list",
  input_clear: "prompt.clear",
  input_paste: "prompt.paste",
  input_submit: "input.submit",
  input_newline: "input.newline",
  input_move_left: "input.move.left",
  input_move_right: "input.move.right",
  input_move_up: "input.move.up",
  input_move_down: "input.move.down",
  input_select_left: "input.select.left",
  input_select_right: "input.select.right",
  input_select_up: "input.select.up",
  input_select_down: "input.select.down",
  input_line_home: "input.line.home",
  input_line_end: "input.line.end",
  input_select_line_home: "input.select.line.home",
  input_select_line_end: "input.select.line.end",
  input_visual_line_home: "input.visual.line.home",
  input_visual_line_end: "input.visual.line.end",
  input_select_visual_line_home: "input.select.visual.line.home",
  input_select_visual_line_end: "input.select.visual.line.end",
  input_buffer_home: "input.buffer.home",
  input_buffer_end: "input.buffer.end",
  input_select_buffer_home: "input.select.buffer.home",
  input_select_buffer_end: "input.select.buffer.end",
  input_delete_line: "input.delete.line",
  input_delete_to_line_end: "input.delete.to.line.end",
  input_delete_to_line_start: "input.delete.to.line.start",
  input_backspace: "input.backspace",
  input_delete: "input.delete",
  input_undo: "input.undo",
  input_redo: "input.redo",
  input_word_forward: "input.word.forward",
  input_word_backward: "input.word.backward",
  input_select_word_forward: "input.select.word.forward",
  input_select_word_backward: "input.select.word.backward",
  input_delete_word_forward: "input.delete.word.forward",
  input_delete_word_backward: "input.delete.word.backward",
  input_select_all: "input.select.all",
  history_previous: "prompt.history.previous",
  history_next: "prompt.history.next",
  terminal_suspend: "terminal.suspend",
  terminal_title_toggle: "terminal.title.toggle",
} satisfies BindingCommandMap
const CommandDescriptions = Object.fromEntries(
  Object.entries(Definitions).map(([name, item]) => [
    CommandMap[name as keyof typeof CommandMap] ?? name,
    item.description,
  ]),
) as Record<string, string>

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
    return { desc: CommandDescriptions[command] }
  }
}
