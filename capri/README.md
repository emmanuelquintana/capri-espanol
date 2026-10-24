# capri/

Capri customizations, developed here first and then copied over the designated upstream files.

| File | Function |
|---|---|
| `capri-theme.json` | Dark-only v2 TUI color theme. Target: `packages/tui/src/theme/assets/` (or `.opencode/themes/` for local use). |
| `CAPRI.md` | Capri persona system prompt (personality, background, voice, behavior limits). Copied by `sync-prompts.sh` into the core prompt dir (applies to every model family); text below the `---` line is the prompt. |
| `cyberpsycosis-none.md`, `-low.md`, `-medium.md`, `-max.md` | Tunable "cyberpsychosis" modules appended after `CAPRI.md`. none = voice only; low = same prompt, but the TUI glitches; medium = recoverable pranks; max = destructive pranks. The TUI glitch (`packages/tui/src/glitch.ts`, `component/cyber-glitch.tsx`) applies to low, medium and max, scaled by level and context use. Effects table: `capri_dev/cyberpsycosis-levels-summary.md`. |
| `sync.sh` | `./sync.sh` copies everything below into `packages/` (edit here first); `./sync.sh from-repo` copies the Capri code back. The prompts lose their header on the way (everything up to the first `---`) and land in `packages/core/src/session/runner/prompt/capri/*.txt`. |
| `capri-logo.ts` | Half-block wordmark. Target: `packages/tui/src/logo.ts`. |
| `capri-logo-tui-large.png`, `capri-logo-tui-small.png` | Logo reference renders. |

## Capri-authored code (copies; `sync.sh` knows the targets)

| File | Target | Function |
|---|---|---|
| `capri.ts` | `packages/core/src/capri.ts` | Reads and writes `~/.config/capri/capri.json`: cyberpsycosis level, glitch probability. |
| `capri-config.ts` | `packages/tui/src/capri-config.ts` | Reads `capri.json` for the TUI: `logo.style`, `hide.thinking`, `hide.toolResults`, `footer.name/model/tps`. |
| `glitch.ts` | `packages/tui/src/glitch.ts` | Glitch engine: rectangles, row shifts, rates by level and context use, painting. |
| `cyber-glitch.tsx` | `packages/tui/src/component/cyber-glitch.tsx` | Mounts the glitch on the renderer's post-process pass. |
| `dialog-cyberpsycosis.tsx` | `packages/tui/src/component/dialog-cyberpsycosis.tsx` | The `/cyberpsycosis` level picker. |
| `glitch.test.ts` | `packages/tui/test/glitch.test.ts` | Tests for the glitch engine. |
| `logo-halfblock.ts`, `logo-image.ts` | `packages/tui/src/` | Alternative logo renderings. |
| `session-index.tsx` | `packages/tui/src/routes/session/index.tsx` | Upstream snapshot. Capri edits: `ToolPart` hides tool output/diffs (`hide.toolResults`); `AssistantFooter` shows the Capri label, model and tok/s only if enabled. |
| `message-parts.tsx` | `packages/tui/src/routes/session/message-parts.tsx` | Upstream snapshot. Capri edit: `reasoningContent` scrambles thinking (`hide.thinking`). |
| `prompt-index.tsx` | `packages/tui/src/component/prompt/index.tsx` | Upstream snapshot. Capri edit: prompt box shows the Capri label, and the model/provider/variant only if `footer.model`. |

## Edits to upstream opencode files (not copied)

| File | Change |
|---|---|
| `packages/core/src/session/system-prompt.ts` | Builds persona + active level + harness guidance. |
| `packages/core/src/session/runner/prompt/system.txt` | First line reworded; harness guidance kept. |
| `packages/core/src/plugin/optimize.ts` | `Plugins` is empty, so the model-family prompts are not used. |
| `packages/tui/src/app.tsx` | `/cyberpsycosis` command and the `<CyberGlitch />` mount. |
| `packages/core/test/*` | Tests updated for the Capri prompt. |

