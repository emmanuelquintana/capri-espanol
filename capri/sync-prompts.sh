#!/usr/bin/env bash
# Copies the Capri persona prompts into packages/core, dropping each file's header (everything up to the first `---` line).
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="$root/packages/core/src/session/runner/prompt/capri"
mkdir -p "$dest"
strip() { awk 'found { print } /^---$/ && !found { found = 1 }' "$1" | sed '1{/^$/d}'; }
strip "$root/capri/CAPRI.md" > "$dest/persona.txt"
for level in none medium max; do
  strip "$root/capri/cyberpsycosis-$level.md" > "$dest/cyberpsycosis-$level.txt"
done
