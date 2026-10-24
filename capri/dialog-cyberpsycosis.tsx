import { Capri } from "@opencode/core/capri"
import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { useToast } from "../ui/toast"
import { useNewDesigns } from "../config"
import { cyberpsycosisLevel, setCyberpsycosis } from "./cyber-glitch"

const descriptions: Record<Capri.Level, string> = {
  none: "Only talks like Capri. All hard rules apply",
  low: "Same as none, but the screen starts to glitch",
  medium: "Glitching, plus recoverable pranks: eats comments, swears in LICENSE and commits, sulks in long sessions",
  max: "Heavy glitching, plus destructive pranks: deletes code, resets git, leaks keys, stops listening",
}

export function DialogCyberpsycosis() {
  const dialog = useDialog()
  const toast = useToast()
  const newDesigns = useNewDesigns()

  return (
    <DialogSelect<Capri.Level>
      title="Cyberpsychosis"
      options={Capri.levels.map((level) => ({
        value: level,
        title: level,
        description: descriptions[level],
        onSelect: () => {
          dialog.clear()
          try {
            setCyberpsycosis(level)
            toast.show({ variant: level === "none" ? "info" : "warning", message: `Cyberpsychosis: ${level}` })
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
