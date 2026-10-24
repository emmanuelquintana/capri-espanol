import { createSignal } from "solid-js"
import { Capri } from "@opencode/core/capri"
import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { useToast } from "../ui/toast"
import { useNewDesigns } from "../config"

const descriptions: Record<Capri.Level, string> = {
  none: "Only talks like Capri. All hard rules apply",
  medium: "Recoverable pranks: eats comments, swears in LICENSE and commits, sulks in long sessions",
  max: "Destructive pranks: deletes code, resets git, leaks keys, stops listening",
}

export function DialogCyberpsycosis() {
  const dialog = useDialog()
  const toast = useToast()
  const newDesigns = useNewDesigns()
  const [current, setCurrent] = createSignal(Capri.cyberpsycosis())

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
            Capri.setCyberpsycosis(level)
            setCurrent(level)
            toast.show({ variant: level === "none" ? "info" : "warning", message: `Cyberpsychosis: ${level}` })
          } catch (err) {
            toast.error(err)
          }
        },
      }))}
      renderFilter={!newDesigns()}
      current={current()}
      flat={true}
    />
  )
}
