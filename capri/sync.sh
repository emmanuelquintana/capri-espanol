#!/usr/bin/env bash
# Keeps capri/ and the opencode tree in step.
#   sync.sh            copy capri/ into packages/ (the normal direction: edit here, then sync)
#   sync.sh from-repo  copy the Capri-authored code in packages/ back into capri/
# Prompts always go capri -> packages: each header (everything up to the first `---` line) is dropped.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
mode="${1:-to-repo}"

# capri/ file -> repo path. Whole-file copies: Capri-authored files, plus upstream files Capri has edited (those are
# snapshots, so after an opencode upstream merge run `sync.sh from-repo` before editing here, never the other way).
code=(
  "capri.ts packages/core/src/capri.ts"
  "capri-config.ts packages/tui/src/capri-config.ts"
  "glitch.ts packages/tui/src/glitch.ts"
  "glitch.test.ts packages/tui/test/glitch.test.ts"
  "cyber-glitch.tsx packages/tui/src/component/cyber-glitch.tsx"
  "dialog-cyberpsycosis.tsx packages/tui/src/component/dialog-cyberpsycosis.tsx"
  "logo-halfblock.ts packages/tui/src/logo-halfblock.ts"
  "logo-image.ts packages/tui/src/logo-image.ts"
  "session-index.tsx packages/tui/src/routes/session/index.tsx"
  "message-parts.tsx packages/tui/src/routes/session/message-parts.tsx"
  "prompt-index.tsx packages/tui/src/component/prompt/index.tsx"
)
for entry in "${code[@]}"; do
  read -r name target <<<"$entry"
  if [ "$mode" = "from-repo" ]; then cp "$root/$target" "$root/capri/$name"; else cp "$root/capri/$name" "$root/$target"; fi
done
[ "$mode" = "from-repo" ] && exit 0

dest="$root/packages/core/src/session/runner/prompt/capri"
mkdir -p "$dest"
strip() { awk 'found { print } /^---$/ && !found { found = 1 }' "$1" | sed '1{/^$/d}'; }
strip "$root/capri/CAPRI.md" > "$dest/persona.txt"
for level in none low medium max; do
  strip "$root/capri/cyberpsycosis-$level.md" > "$dest/cyberpsycosis-$level.txt"
done
