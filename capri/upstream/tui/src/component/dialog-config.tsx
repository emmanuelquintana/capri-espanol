import { createMemo, createSignal } from "solid-js"
import { useConfig, useNewDesigns } from "../config"
import { useThemes } from "../context/theme"
import { useDialog, type DialogContext } from "../ui/dialog"
import { DialogSelect, DialogSelectChoice } from "../ui/dialog-select"
import { useToast } from "../ui/toast"
import { DialogThemeList } from "./dialog-theme-list"
import { spanishLabel } from "../util/spanish"

type Setting = {
  title: string
  category: string
  path: string[]
  /** Shown below the list while the setting is selected, under the "new-designs" experiment. */
  description: string
  default: unknown
  values?: readonly unknown[]
  labels?: readonly string[]
  step?: number
  min?: number
  max?: number
  format?: (value: unknown) => string
  keywords?: readonly string[]
  /** Under the "new-designs" experiment, enter opens this picker instead of cycling. ←/→ still cycle. */
  open?: (dialog: DialogContext) => void
}

export const settings: Setting[] = [
  {
    title: "Tema",
    category: "Apariencia",
    path: ["theme", "name"],
    description: "Tema de color de la interfaz",
    default: "opencode",
    keywords: ["color scheme", "colors"],
    open: (dialog) =>
      dialog.replace(() => (
        <DialogThemeList onClose={() => dialog.replace(() => <DialogConfig current="theme.name" />)} />
      )),
  },
  {
    title: "Modo de color",
    category: "Apariencia",
    path: ["theme", "mode"],
    description: "Variante clara, oscura o según el sistema",
    default: "system",
    values: ["system", "dark", "light"],
    keywords: ["dark mode", "light mode", "system theme"],
  },
  {
    title: "Animaciones",
    category: "Apariencia",
    path: ["animations"],
    description: "Animar indicadores de carga y transiciones",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["motion", "effects"],
  },
  {
    title: "Panel lateral",
    category: "Sesión",
    path: ["session", "sidebar"],
    description: "Mostrar el panel lateral cuando haya espacio",
    default: "auto",
    values: ["hide", "auto"],
    keywords: ["side panel"],
  },
  {
    title: "Barra de desplazamiento",
    category: "Sesión",
    path: ["session", "scrollbar"],
    description: "Mostrar una barra de desplazamiento junto al chat",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["scroll bar"],
  },
  {
    title: "Razonamiento",
    category: "Sesión",
    path: ["session", "thinking"],
    description: "Mostrar el razonamiento del modelo en el chat",
    default: "hide",
    values: ["hide", "show"],
    keywords: ["reasoning", "chain of thought"],
  },
  {
    title: "Markdown",
    category: "Sesión",
    path: ["session", "markdown"],
    description: "Mostrar Markdown con formato o como texto fuente",
    default: "rendered",
    values: ["source", "rendered"],
    keywords: ["syntax", "concealment", "rendering"],
  },
  {
    title: "Agrupación de herramientas",
    category: "Sesión",
    path: ["session", "grouping"],
    description: "Agrupar lecturas y búsquedas consecutivas",
    default: "auto",
    values: ["none", "auto"],
    keywords: ["transcript", "messages", "reads", "searches"],
  },
  {
    title: "Nivel de detalle",
    category: "Sesión",
    path: ["session", "verbosity"],
    description: "Cantidad de actividad de herramientas que se muestra",
    default: "medium",
    values: ["low", "medium", "high"],
    keywords: ["detail", "activity", "summary", "transcript"],
  },
  {
    title: "Imágenes en la conversación",
    category: "Sesión",
    path: ["session", "image_preview"],
    description: "Mostrar imágenes en el chat",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["attachments", "images", "tool output"],
  },
  {
    title: "TPS",
    category: "Sesión",
    path: ["session", "tps"],
    description: "Mostrar los tokens por segundo de las respuestas",
    default: true,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["tokens per second", "throughput"],
  },
  {
    title: "Ubicación de las nuevas sesiones",
    category: "Sesión",
    path: ["session", "new_location"],
    description: "Directorio inicial de las nuevas sesiones",
    default: "launch",
    values: ["launch", "inherit"],
    labels: ["directorio de inicio", "sesión activa"],
    keywords: ["directory", "cwd", "inherit"],
  },
  {
    title: "Permisos",
    category: "Sesión",
    path: ["session", "permissions"],
    description: "Solicitar permiso o aceptar automáticamente",
    default: "prompt",
    values: ["prompt", "autoaccept"],
    labels: ["prompt", "aceptar automáticamente"],
    keywords: ["approve", "accept", "permission requests"],
  },
  {
    title: "Modo",
    category: "Pestañas",
    path: ["tabs", "mode"],
    description: "Abrir las sesiones en pestañas",
    default: "auto",
    values: ["off", "on", "auto"],
  },
  {
    title: "Ámbito",
    category: "Pestañas",
    path: ["tabs", "scope"],
    description: "Separar las pestañas por directorio o compartirlas",
    default: "cwd",
    values: ["cwd", "global"],
    labels: ["directorio actual", "global"],
  },
  {
    title: "Distribución",
    category: "Pestañas",
    path: ["tabs", "layout"],
    description: "Colocar las pestañas arriba o en un lateral",
    default: "horizontal",
    values: ["horizontal", "vertical"],
    keywords: ["sidebar", "orientation", "left"],
  },
  {
    title: "Indicadores",
    category: "Pestañas",
    path: ["tabs", "indicators"],
    description: "Mostrar iconos de estado o siempre números",
    default: "status",
    values: ["status", "numbers"],
    labels: ["iconos de estado", "siempre mostrar números"],
    keywords: ["tab numbers", "number mode", "iconos de estado"],
  },
  {
    title: "Distribución",
    category: "Diferencias",
    path: ["diffs", "view"],
    description: "Mostrar diferencias en paralelo o en una columna",
    default: "auto",
    values: ["auto", "split", "unified"],
    keywords: ["diff layout", "split diff", "unified diff"],
  },
  {
    title: "Ajuste de líneas",
    category: "Diferencias",
    path: ["diffs", "wrap"],
    description: "Ajustar las líneas largas en las diferencias",
    default: "word",
    values: ["none", "word"],
    keywords: ["diff wrap", "word wrap", "line wrap"],
  },
  {
    title: "Árbol de archivos",
    category: "Diferencias",
    path: ["diffs", "tree"],
    description: "Mostrar el árbol de archivos junto a las diferencias",
    default: true,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["diff files"],
  },
  {
    title: "Un archivo a la vez",
    category: "Diferencias",
    path: ["diffs", "single"],
    description: "Mostrar las diferencias de un archivo a la vez",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["one file", "selected file"],
  },
  {
    title: "Velocidad de desplazamiento",
    category: "Entrada",
    path: ["scroll", "speed"],
    description: "Distancia de cada paso de desplazamiento",
    default: 3,
    step: 0.25,
    min: 0.25,
    max: 10,
    format: (value) => Number(value).toFixed(2),
    keywords: ["scrolling"],
  },
  {
    title: "Aceleración",
    category: "Entrada",
    path: ["scroll", "acceleration"],
    description: "Acelerar el desplazamiento con movimientos rápidos",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["scroll acceleration"],
  },
  {
    title: "Ratón",
    category: "Entrada",
    path: ["mouse"],
    description: "Permitir el uso del ratón en la interfaz",
    default: true,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["mouse capture"],
  },
  {
    title: "Contexto del editor",
    category: "Entrada",
    path: ["prompt", "editor"],
    description: "Añadir la selección del editor al mensaje",
    default: true,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["file context", "prompt context", "editor selection"],
  },
  {
    title: "Texto pegado extenso",
    category: "Entrada",
    path: ["prompt", "paste"],
    description: "Resumir el texto pegado extenso o mostrarlo completo",
    default: "compact",
    values: ["compact", "full"],
    keywords: ["paste summary", "clipboard", "pasted content"],
  },
  {
    title: "Vistas previas de imágenes",
    category: "Entrada",
    path: ["prompt", "image_preview"],
    description: "Mostrar vistas previas de imágenes adjuntas",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["attachments", "clipboard", "images", "prompt"],
  },
  {
    title: "Espera de la tecla prefijo",
    category: "Entrada",
    path: ["leader", "timeout"],
    description: "Tiempo de espera de la tecla prefijo",
    default: 2000,
    step: 250,
    min: 250,
    max: 10000,
    format: (value) => `${value} ms`,
    keywords: ["leader key", "shortcut timeout"],
  },
  {
    title: "Notificaciones",
    category: "Alertas",
    path: ["attention", "notifications"],
    description: "Notificar cuando una sesión requiera atención",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["system notifications", "desktop notifications", "alerts"],
  },
  {
    title: "Sonidos",
    category: "Alertas",
    path: ["attention", "sound"],
    description: "Reproducir un sonido cuando una sesión requiera atención",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["audio", "sound effects", "alerts"],
  },
  {
    title: "Volumen",
    category: "Alertas",
    path: ["attention", "volume"],
    description: "Volumen de las alertas",
    default: 0.4,
    step: 0.1,
    min: 0,
    max: 1,
    format: (value) => `${Math.round(Number(value) * 100)}%`,
    keywords: ["sound volume", "audio volume"],
  },
  {
    title: "Novedades de la versión",
    category: "Alertas",
    path: ["highlights"],
    description: "Mostrar novedades después de una actualización",
    default: true,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["what's new", "changelog", "release notes"],
  },
  {
    title: "Título de la ventana",
    category: "Terminal",
    path: ["terminal", "title"],
    description: "Mostrar la sesión actual en el título de la ventana",
    default: true,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["terminal title", "tab title"],
  },
  {
    title: "Comportamiento de copia",
    category: "Terminal",
    path: ["terminal", "copy"],
    description: "Copiar texto al seleccionarlo",
    default: process.platform === "win32" ? "manual" : "select",
    values: ["manual", "select"],
    keywords: ["selection", "clipboard"],
  },
  {
    title: "Herramientas de desarrollo",
    category: "Depuración",
    path: ["debug", "devtools"],
    description: "Mostrar la barra de herramientas de desarrollo",
    default: false,
    values: [false, true],
    labels: ["off", "on"],
    keywords: ["debug bar", "herramientas de desarrollo"],
  },
]

export function settingID(setting: Setting) {
  return setting.path.join(".")
}

export function DialogConfig(props: { current?: string }) {
  const config = useConfig()
  const newDesigns = useNewDesigns()
  const dialog = useDialog()
  const toast = useToast()
  const themes = useThemes()
  const current = Math.max(
    0,
    settings.findIndex((setting) => settingID(setting) === props.current),
  )
  const [selected, setSelected] = createSignal(current)
  const [saving, setSaving] = createSignal(false)

  const value = (setting: Setting) => {
    const current = setting.path.reduce<unknown>((result, key) => {
      if (!result || typeof result !== "object") return undefined
      return (result as Record<string, unknown>)[key]
    }, config.data)
    if (setting.path.join(".") === "theme.name") return current ?? themes.selected
    return current ?? setting.default
  }
  const values = (setting: Setting) =>
    setting.path.join(".") === "theme.name"
      ? Object.keys(themes.all()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      : setting.values
  const display = (setting: Setting) => {
    const current = value(setting)
    if (setting.format) return setting.format(current)
    const index = setting.values?.indexOf(current)
    return spanishLabel(index === undefined || index < 0 ? String(current) : (setting.labels?.[index] ?? String(current)))
  }
  const options = createMemo(() =>
    settings.map((setting, index) => ({
      title: setting.title,
      category: setting.category,
      searchText: setting.keywords?.join(" "),
      footer: newDesigns() ? (
        <DialogSelectChoice value={display(setting)} active={selected() === index} open={setting.open !== undefined} />
      ) : (
        display(setting)
      ),
      footerOverhang: newDesigns() ? 2 : undefined,
      detail: newDesigns() ? setting.description : undefined,
      value: index,
    })),
  )

  async function change(direction: number, index = selected()) {
    if (saving()) return
    const setting = settings[index]
    const current = value(setting)
    const choices = values(setting)
    const next = choices
      ? choices[(choices.indexOf(current) + direction + choices.length) % choices.length]
      : Math.min(setting.max!, Math.max(setting.min!, Number(current) + direction * setting.step!))
    if (next === current) return
    setSaving(true)
    await config
      .update((draft) => {
        const parent = setting.path.slice(0, -1).reduce<Record<string, unknown>>((result, key) => {
          if (!result[key] || typeof result[key] !== "object") result[key] = {}
          return result[key] as Record<string, unknown>
        }, draft)
        parent[setting.path.at(-1)!] = next
      })
      .catch(toast.error)
      .finally(() => setSaving(false))
  }

  return (
    <DialogSelect
      title="Configuración"
      searchInTitle
      titlePlaceholder="Buscar ajustes"
      options={options()}
      // Under new designs the opening setting is focused without the current-item marker; changing a value keeps the
      // selection where it is.
      current={newDesigns() ? undefined : current}
      focusTarget={newDesigns() ? current : undefined}
      preserveSelection={newDesigns()}
      filterThreshold={0.7}
      onMove={(option) => setSelected(option.value)}
      onSelect={(option) => {
        const open = settings[option.value].open
        if (newDesigns() && open) return open(dialog)
        void change(1, option.value)
      }}
      footerHints={newDesigns() ? [] : [{ title: "change", label: "←/→" }]}
      bindings={[
        {
          bind: "left",
          title: "Valor anterior",
          group: "Settings",
          run: () => void change(-1),
        },
        {
          bind: "right",
          title: "Valor siguiente",
          group: "Settings",
          run: () => void change(1),
        },
      ]}
    />
  )
}
