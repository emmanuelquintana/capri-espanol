import { createSignal } from "solid-js"
import { openPath } from "@opencode/util/open"
import { useRenderer } from "@opentui/solid"
import { useClipboard } from "../context/clipboard"
import { useDialog } from "./dialog"
import { DialogSelect } from "./dialog-select"
import { useToast } from "./toast"

export function useWorkingDirectoryActions(input: { directory: () => string | undefined; onMove?: () => void }) {
  const clipboard = useClipboard()
  const dialog = useDialog()
  const renderer = useRenderer()
  const toast = useToast()
  const [hovered, setHovered] = createSignal(false)

  function openMenu() {
    if (renderer.getSelection()?.getSelectedText()) return
    const directory = input.directory()
    if (!directory) return
    dialog.replace(() => (
      <DialogSelect
        title="Directorio de trabajo"
        renderFilter={false}
        options={[
          {
            title: "Copiar ruta",
            value: "location.copy",
            description: directory,
            onSelect: (dialog) => {
              void clipboard.write(directory).then(() => {
                dialog.clear()
                toast.show({ message: "Ruta copiada al portapapeles", variant: "info" })
              }, toast.error)
            },
          },
          {
            title: "Abrir carpeta",
            value: "location.open",
            description: "en el explorador de archivos del sistema",
            onSelect: (dialog) => {
              dialog.clear()
              void openPath(directory).catch(toast.error)
            },
          },
          ...(input.onMove
            ? [
                {
                  title: "Espacios de trabajo",
                  value: "session.move",
                  description: "a otro directorio de trabajo",
                  onSelect: () => void input.onMove?.(),
                },
              ]
            : []),
        ]}
      />
    ))
  }

  return {
    hovered,
    onMouseOver: () => setHovered(true),
    onMouseOut: () => setHovered(false),
    onMouseUp: openMenu,
  }
}
