export * as Config from "."

import { createBindingLookup } from "@opentui/keymap/extras"
import { Vcs } from "@opencode/schema/vcs"
import { Schema } from "effect"
import { createContext, onCleanup, type JSX, useContext } from "solid-js"
import { createStore, reconcile } from "solid-js/store"
import { safeWatch } from "../util/watch"
import path from "path"
import { TuiKeybind } from "./keybind"

export interface Interface {
  readonly path?: string
  readonly get: () => Promise<Info>
  readonly update: (update: (draft: any) => void) => Promise<Info>
}

export const AttentionSoundName = Schema.Literals([
  "default",
  "question",
  "permission",
  "error",
  "done",
  "subagent_done",
])
export type AttentionSoundName = Schema.Schema.Type<typeof AttentionSoundName>
export type AttentionSoundPaths = Partial<Record<AttentionSoundName, string>>

export const MiniWorkSpinner = Schema.Literals([
  "block-soft-slide",
  "block-soft-sweep",
  "block-low-comet",
  "block-low-duet",
  "block-shuttle",
  "block-bridge",
  "block-squeeze",
  "small-toggle",
  "square-toggle",
  "grow-shrink",
  "quadrant-orbit",
  "crosshatch",
  "density-wave",
  "seed",
])
export type MiniWorkSpinner = Schema.Schema.Type<typeof MiniWorkSpinner>

export const Plugin = Schema.Union([
  Schema.String,
  Schema.Struct({
    package: Schema.String.annotate({ description: "Nombre o ruta del paquete del complemento" }),
    options: Schema.optional(Schema.Record(Schema.String, Schema.Any)).annotate({
      description: "Opciones del complemento",
    }),
  }),
])

export const DiffSource = Schema.Union([Vcs.Mode, Schema.Literal("turn")])
export type DiffSource = Schema.Schema.Type<typeof DiffSource>

export const Cursor = Schema.Struct({
  style: Schema.optional(Schema.Literals(["block", "underline", "line", "default"])).annotate({
    description: "Forma del cursor. Usa 'default' para conservar la de la terminal",
  }),
  blinking: Schema.optional(Schema.Boolean).annotate({
    description: "Parpadeo del cursor. No se aplica si el estilo es 'default'",
  }),
}).annotate({ description: "Ajustes del cursor de la terminal" })

export const Info = Schema.Struct({
  theme: Schema.optional(
    Schema.Struct({
      name: Schema.optional(Schema.String).annotate({ description: "Nombre del tema" }),
      mode: Schema.optional(Schema.Literals(["system", "dark", "light"])).annotate({
        description: "Modo de color; 'system' sigue el de la terminal",
      }),
    }),
  ).annotate({ description: "Ajustes del tema de color" }),
  keybinds: Schema.optional(TuiKeybind.KeybindOverrides).annotate({ description: "Atajos de teclado personalizados" }),
  plugins: Schema.optional(Schema.Array(Plugin)).annotate({
    description: "Activación ordenada de complementos y declaración de paquetes externos",
  }),
  leader: Schema.optional(
    Schema.Struct({
      timeout: Schema.optional(Schema.Int.check(Schema.isGreaterThan(0))).annotate({
        description: "Milisegundos de espera tras la tecla prefijo",
      }),
    }),
  ).annotate({ description: "Comportamiento de la tecla prefijo" }),
  scroll: Schema.optional(
    Schema.Struct({
      speed: Schema.optional(Schema.Finite.check(Schema.isGreaterThanOrEqualTo(0.001))).annotate({
        description: "Distancia por paso de desplazamiento",
      }),
      acceleration: Schema.optional(Schema.Boolean).annotate({
        description: "Acelerar el desplazamiento al repetirlo",
      }),
    }),
  ).annotate({ description: "Comportamiento del desplazamiento" }),
  attention: Schema.optional(
    Schema.Struct({
      notifications: Schema.optional(Schema.Boolean).annotate({ description: "Mostrar notificaciones del sistema" }),
      sound: Schema.optional(Schema.Boolean).annotate({ description: "Reproducir sonidos de aviso" }),
      volume: Schema.optional(
        Schema.Finite.check(Schema.isGreaterThanOrEqualTo(0), Schema.isLessThanOrEqualTo(1)),
      ).annotate({ description: "Volumen de los avisos de 0 a 1" }),
      sound_pack: Schema.optional(Schema.String).annotate({ description: "ID del paquete de sonidos activo" }),
      sounds: Schema.optional(Schema.Record(AttentionSoundName, Schema.optionalKey(Schema.String))).annotate({
        description: "Archivos de sonido personalizados por evento",
      }),
    }),
  ).annotate({ description: "Ajustes de notificaciones y sonidos" }),
  diffs: Schema.optional(
    Schema.Struct({
      source: Schema.optional(DiffSource).annotate({
        description:
          "Origen inicial de diferencias: 'branch' incluye rama y cambios sin confirmar; 'turn' muestra el último turno y usa 'branch' fuera de una sesión",
      }),
      wrap: Schema.optional(Schema.Literals(["word", "none"])).annotate({
        description: "Ajuste de líneas en las diferencias",
      }),
      tree: Schema.optional(Schema.Boolean).annotate({ description: "Mostrar el árbol de archivos de diferencias" }),
      single: Schema.optional(Schema.Boolean).annotate({ description: "Mostrar solo el parche del archivo seleccionado" }),
      fullscreen: Schema.optional(Schema.Boolean).annotate({
        description: "Abrir diferencias a pantalla completa; recordar el último estado",
      }),
      view: Schema.optional(Schema.Literals(["auto", "split", "unified"])).annotate({
        description: "Distribución de diferencias; 'auto' se adapta al ancho disponible",
      }),
    }),
  ).annotate({ description: "Ajustes de presentación de diferencias" }),
  terminal: Schema.optional(
    Schema.Struct({
      title: Schema.optional(Schema.Boolean).annotate({ description: "Actualizar el título de la terminal" }),
      copy: Schema.optional(Schema.Literals(["manual", "select"])).annotate({
        description: "Copiar texto manualmente o al seleccionarlo",
      }),
    }),
  ).annotate({ description: "Ajustes de integración de terminal" }),
  prompt: Schema.optional(
    Schema.Struct({
      editor: Schema.optional(Schema.Boolean).annotate({
        description: "Incluir el archivo o selección del editor como contexto",
      }),
      paste: Schema.optional(Schema.Literals(["compact", "full"])).annotate({
        description: "Resumir texto pegado extenso o mostrarlo completo",
      }),
      image_preview: Schema.optional(Schema.Boolean).annotate({
        description: "Mostrar imágenes adjuntas sobre la entrada",
      }),
    }),
  ).annotate({ description: "Comportamiento de la entrada de mensajes" }),
  session: Schema.optional(
    Schema.Struct({
      sidebar: Schema.optional(Schema.Literals(["auto", "hide"])).annotate({
        description: "Visibilidad del panel lateral; 'auto' lo muestra cuando hay espacio",
      }),
      scrollbar: Schema.optional(Schema.Boolean).annotate({ description: "Mostrar barra de desplazamiento de la conversación" }),
      thinking: Schema.optional(Schema.Literals(["show", "hide"])).annotate({
        description: "Mostrar u ocultar el razonamiento por defecto",
      }),
      grouping: Schema.optional(Schema.Literals(["auto", "none"])).annotate({
        description: "Agrupar elementos relacionados o mostrarlos individualmente",
      }),
      verbosity: Schema.optional(Schema.Literals(["low", "medium", "high"])).annotate({
        description:
          "Detalle de conversación: low resume herramientas y razonamiento; high expande exploraciones e instrucciones",
      }),
      image_preview: Schema.optional(Schema.Boolean).annotate({
        description: "Mostrar imágenes adjuntas y de herramientas en la conversación",
      }),
      tps: Schema.optional(Schema.Boolean).annotate({
        description: "Mostrar promedio de tokens por segundo",
      }),
      markdown: Schema.optional(Schema.Literals(["source", "rendered"])).annotate({
        description: "Mostrar u ocultar los marcadores de sintaxis Markdown",
      }),
      new_location: Schema.optional(Schema.Literals(["launch", "inherit"])).annotate({
        description: "Iniciar sesiones en el directorio de lanzamiento o heredar la ubicación actual",
      }),
      permissions: Schema.optional(Schema.Literals(["prompt", "autoaccept"])).annotate({
        description: "Solicitar permisos o aceptarlos automáticamente",
      }),
    }),
  ).annotate({ description: "Ajustes de presentación de la conversación" }),
  tabs: Schema.optional(
    Schema.Struct({
      mode: Schema.optional(Schema.Literals(["auto", "on", "off"])).annotate({
        description: "Usar pestañas siempre, nunca o cuando la terminal sea compatible",
      }),
      enabled: Schema.optional(Schema.Boolean).annotate({
        description: "Interruptor antiguo de pestañas; usar mode en su lugar",
      }),
      scope: Schema.optional(Schema.Literals(["global", "cwd"])).annotate({
        description: "Compartir pestañas globalmente o separarlas por directorio",
      }),
      layout: Schema.optional(Schema.Literals(["horizontal", "vertical"])).annotate({
        description: "Mostrar pestañas en una franja horizontal o un panel vertical",
      }),
      indicators: Schema.optional(Schema.Literals(["status", "numbers"])).annotate({
        description: "Mostrar iconos de estado o siempre números de pestaña",
      }),
    }),
  ).annotate({ description: "Ajustes de la barra de pestañas" }),
  mini: Schema.optional(
    Schema.Struct({
      thinking: Schema.optional(Schema.Literals(["show", "hide"])).annotate({
        description: "Mostrar u ocultar razonamiento del modelo",
      }),
      tools: Schema.optional(Schema.Literals(["show", "hide"])).annotate({
        description: "Mostrar u ocultar llamadas a herramientas y el texto que las precede",
      }),
      shell_output: Schema.optional(Schema.Literals(["show", "hide"])).annotate({
        description: "Mostrar u ocultar la salida sin procesar de la terminal",
      }),
      turn_summary: Schema.optional(Schema.Literals(["show", "hide"])).annotate({
        description: "Mostrar u ocultar agente, modelo y duración en el historial",
      }),
      footer: Schema.optional(Schema.Literals(["show", "hide"])).annotate({
        description: "Show or hide persistent activity, model, usage, and context details in the footer",
      }),
      splash: Schema.optional(Schema.Literals(["show", "hide"])).annotate({
        description: "Show or hide the entry and exit splash banners",
      }),
      work_spinner: Schema.optional(MiniWorkSpinner).annotate({
        description: "Work spinner animation in the Mini footer (default: block-soft-slide)",
      }),
      mono: Schema.optional(Schema.Boolean).annotate({
        description: "Use monochrome ASCII output",
      }),
      replay: Schema.optional(Schema.Boolean).annotate({
        description: "Restaurar historial al reanudar y cambiar el tamaño de la terminal",
      }),
      replay_limit: Schema.optional(Schema.Int.check(Schema.isGreaterThan(0))).annotate({
        description: "Máximo de mensajes recientes que se restauran",
      }),
    }),
  ).annotate({ description: "Ajustes de conversación del modo Mini" }),
  debug: Schema.optional(
    Schema.Struct({
      devtools: Schema.optional(Schema.Boolean).annotate({ description: "Mostrar barra de depuración" }),
      timing: Schema.optional(Schema.Boolean).annotate({ description: "Mostrar tiempo hasta el primer renderizado" }),
      turn_tokens: Schema.optional(Schema.Union([Schema.Boolean, Schema.Literal("verbose")])).annotate({
        description: "Mostrar uso de tokens por turno y, opcionalmente, entradas de herramientas",
      }),
    }),
  ).annotate({ description: "Ajustes de depuración" }),
  experimental: Schema.optional(Schema.Record(Schema.String, Schema.Boolean)).annotate({
    description: "Funciones experimentales que pueden cambiar o eliminarse",
  }),
  animations: Schema.optional(Schema.Boolean).annotate({ description: "Activar animaciones de la interfaz" }),
  highlights: Schema.optional(Schema.Boolean).annotate({
    description: "Mostrar novedades después de actualizar Capri",
  }),
  mouse: Schema.optional(Schema.Boolean).annotate({ description: "Activar captura del ratón en la terminal" }),
  cursor: Schema.optional(Cursor),
})
export type Info = Schema.Schema.Type<typeof Info>

export type Resolved = Omit<Info, "attention" | "cursor" | "keybinds" | "leader" | "mouse" | "session" | "tabs"> & {
  attention: {
    notifications: boolean
    sound: boolean
    volume: number
    sound_pack: string
    sounds: AttentionSoundPaths
  }
  keybinds: TuiKeybind.BindingLookupView
  leader: { timeout: number }
  mouse: boolean
  cursor?: {
    style: "block" | "underline" | "line" | "default"
    blinking: boolean
  }
  session: Omit<NonNullable<Info["session"]>, "new_location" | "permissions" | "tps"> & {
    new_location: "launch" | "inherit"
    permissions: "prompt" | "autoaccept"
    tps: boolean
  }
  tabs: {
    mode: "auto" | "on" | "off"
    enabled: boolean
    scope: "global" | "cwd"
    layout: "horizontal" | "vertical"
    indicators: "status" | "numbers"
  }
}

export function resolve(
  input: Info,
  options: { terminalSuspend: boolean; environment?: Readonly<Record<string, string | undefined>> },
): Resolved {
  const tabsMode = input.tabs?.mode ?? (input.tabs?.enabled === undefined ? "auto" : input.tabs.enabled ? "on" : "off")
  const keybinds: TuiKeybind.KeybindOverrides = { ...input.keybinds }
  if (!options.terminalSuspend) {
    keybinds["terminal.suspend"] = "none"
    if (keybinds["input.undo"] === undefined) {
      const inputUndo = TuiKeybind.defaultValue("input.undo")
      keybinds["input.undo"] = ["ctrl+z", ...(typeof inputUndo === "string" ? inputUndo.split(",") : [])]
        .filter((value, index, values) => values.indexOf(value) === index)
        .join(",")
    }
  }

  return {
    ...input,
    attention: {
      notifications: input.attention?.notifications ?? false,
      sound: input.attention?.sound ?? false,
      volume: input.attention?.volume ?? 0.4,
      sound_pack: input.attention?.sound_pack ?? "opencode.default",
      sounds: input.attention?.sounds ?? {},
    },
    keybinds: createBindingLookup(TuiKeybind.toBindingConfig(TuiKeybind.parse(keybinds)), {
      bindingDefaults: TuiKeybind.bindingDefaults(),
    }),
    leader: { timeout: input.leader?.timeout ?? 2000 },
    mouse: input.mouse ?? true,
    cursor: input.cursor
      ? {
          style: input.cursor.style ?? "block",
          blinking: input.cursor.blinking ?? true,
        }
      : undefined,
    session: {
      ...input.session,
      new_location: input.session?.new_location ?? "launch",
      permissions: input.session?.permissions ?? "prompt",
      tps: input.session?.tps ?? true,
    },
    tabs: {
      ...input.tabs,
      mode: tabsMode,
      enabled: tabsMode === "on" || (tabsMode === "auto" && (options.environment ?? process.env).HERDR_ENV !== "1"),
      scope: input.tabs?.scope ?? "cwd",
      layout: input.tabs?.layout ?? "horizontal",
      indicators: input.tabs?.indicators ?? "status",
    },
  }
}

const ConfigContext = createContext<{
  data: Resolved
  path?: string
  update: Interface["update"]
}>()

export function ConfigProvider(props: {
  config: Resolved
  service?: Interface
  options?: { terminalSuspend: boolean; environment?: Readonly<Record<string, string | undefined>> }
  children: JSX.Element
}) {
  const [config, setConfig] = createStore(props.config)
  const host = props.service
  const apply = (info: Info) => setConfig(reconcile(resolve(info, props.options ?? { terminalSuspend: true })))
  const update = async (update: (draft: any) => void) => {
    if (!host) throw new Error("Config updates are not available")
    const info = await host.update(update)
    apply(info)
    return info
  }
  let reload = Promise.resolve()
  const watcher = host?.path
    ? safeWatch(path.dirname(host.path), () => {
        reload = reload
          .then(() => host.get())
          .then(apply)
          .catch(() => {})
      })
    : undefined
  onCleanup(() => watcher?.close())
  return (
    <ConfigContext.Provider value={{ data: config, path: host?.path, update }}>{props.children}</ConfigContext.Provider>
  )
}

export function useConfig() {
  const value = useContext(ConfigContext)
  if (!value) throw new Error("ConfigProvider is missing")
  return value
}

/** Reactive accessor for the temporary "new-designs" experiment. */
export function useNewDesigns() {
  const config = useConfig()
  return () => config.data.experimental?.["new-designs"] === true
}

/** Reactive accessor for the temporary "client-mcp" experiment. */
export function useClientMcpExperiment() {
  const config = useConfig()
  return () => config.data.experimental?.["client-mcp"] === true
}
