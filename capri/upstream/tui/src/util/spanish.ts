// Translate display labels while keeping configuration values and command IDs stable.
const labels: Record<string, string> = {
  Session: "Sesión", Agent: "Agente", Model: "Modelo", Prompt: "Mensaje",
  System: "Sistema", Integration: "Integración", Free: "Gratis",
  Popular: "Populares", Services: "Servicios", Appearance: "Apariencia",
  Tabs: "Pestañas", Input: "Entrada", Server: "Servidor", Dialog: "Diálogo",
  off: "desactivado", on: "activado", system: "sistema", dark: "oscuro", light: "claro",
  auto: "automático", hide: "ocultar", show: "mostrar", none: "ninguno",
  source: "fuente", rendered: "con formato", low: "bajo", medium: "medio", high: "alto",
  launch: "inicio", inherit: "heredar", prompt: "preguntar", autoaccept: "aceptar automáticamente",
  cwd: "directorio actual", global: "global", horizontal: "horizontal", vertical: "vertical",
  status: "estado", numbers: "números", split: "dividido", unified: "unificado", word: "palabra",
  manual: "manual", selection: "al seleccionar", saving: "guardando", current: "actual",
  submit: "enviar", save: "guardar", choose: "elegir", next: "seguir", done: "listo",
  acknowledge: "confirmar", "open URL": "abrir URL", copy: "copiar", close: "cerrar",
}

export function spanishLabel(value: string) {
  return labels[value] ?? value
}
