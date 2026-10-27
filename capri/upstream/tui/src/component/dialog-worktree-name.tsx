import { Slug } from "@opencode/core/util/slug"
import { useNewDesigns } from "../config"
import { type DialogContext } from "../ui/dialog"
import { DialogPrompt } from "../ui/dialog-prompt"

export function DialogWorktreeName(props: { onConfirm: (name: string) => void }) {
  const newDesigns = useNewDesigns()
  return (
    <DialogPrompt
      title="Nombrar árbol de trabajo"
      placeholder="Nombre del árbol de trabajo"
      onConfirm={(value) => props.onConfirm(slugify(value) || Slug.create())}
      actions={[
        {
          title: newDesigns() ? "generar nombre" : "generar uno",
          command: "dialog.worktree.generate",
          commandTitle: "Generar nombre del árbol de trabajo",
          onTrigger: (prompt) => prompt.setValue(Slug.create()),
        },
      ]}
    />
  )
}

DialogWorktreeName.show = (dialog: DialogContext) =>
  new Promise<string | null>((resolve) => {
    dialog.replace(
      () => <DialogWorktreeName onConfirm={resolve} />,
      () => resolve(null),
    )
  })

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}
