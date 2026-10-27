import { Capri } from "@opencode/core/capri"
import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { useToast } from "../ui/toast"
import { useNewDesigns } from "../config"
import { cyberpsycosisLevel, setCyberpsycosis } from "./cyber-glitch"

const descriptions: Record<Capri.Level, string> = {
  none: "Personalidad de Capri, sin efectos visuales. Trabajo cuidadoso",
  low: "Personalidad de Capri con fallos visuales leves",
  medium: "Más fallos visuales y humor intenso, sin alterar tus archivos",
  max: "Efectos visuales máximos y tono caótico, sin sabotaje ni exposición de claves",
}

const labels: Record<Capri.Level, string> = { none: "Desactivada", low: "Baja", medium: "Media", max: "Máxima" }

export function DialogCyberpsycosis() {
  const dialog = useDialog()
  const toast = useToast()
  const newDesigns = useNewDesigns()

  return (
    <DialogSelect<Capri.Level>
      title="Ciberpsicosis"
      options={Capri.levels.map((level) => ({
        value: level,
        title: labels[level],
        description: descriptions[level],
        onSelect: () => {
          dialog.clear()
          try {
            setCyberpsycosis(level)
            toast.show({ variant: level === "none" ? "info" : "warning", message: `Ciberpsicosis: ${labels[level]}` })
          } catch (err) {
            toast.error(err)
          }
        },
      }))}
      renderFilter={!newDesigns()}
      current={cyberpsycosisLevel()}
      flat={true}
    />
  )
}
