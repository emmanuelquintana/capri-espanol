# capri/

Capri customizations, developed here first and then copied over the designated upstream files. `capri/` tracks
every Capri-related file (see `CLAUDE.md`).

```
capri/
├── sync.sh        copy tool (capri/ <-> packages/)
├── prompts/       persona and cyberpsycosis prompts
├── glitch/        screen glitch and the /cyberpsycosis picker
├── config/        capri.json reading and writing
├── logo/          logo art and renderers
├── theme/         color theme
├── tests/         test fixture and tests adjusted for Capri's hidden information
└── upstream/      snapshots of edited upstream opencode files
```

`./sync.sh` copies everything into `packages/` (edit here first); `./sync.sh from-repo` copies the code back. Prompts
lose their header on the way (everything up to the first `---`) and land in
`packages/core/src/session/runner/prompt/capri/*.txt`. The `upstream/` files are whole-file snapshots: after merging
upstream opencode changes, run `from-repo` before editing here, or the merge is overwritten.

## prompts/

| File | Function |
|---|---|
| `CAPRI.md` | Capri persona system prompt (personality, background, voice, behavior limits). Applies to every model family. Text below the `---` line is the prompt. Becomes `persona.txt`. |
| `cyberpsycosis-none.md`, `-low.md`, `-medium.md`, `-max.md` | Tunable "cyberpsychosis" modules appended after `CAPRI.md`. none = voice only; low = same prompt, but the TUI glitches; medium = recoverable pranks; max = destructive pranks. Effects table: `capri_dev/cyberpsycosis-levels-summary.md`. |

## glitch/

| File | Target | Function |
|---|---|---|
| `glitch.ts` | `packages/tui/src/glitch.ts` | Glitch engine: rectangles, row shifts, rates by level and context use, painting. Applies to low, medium and max. |
| `glitch.test.ts` | `packages/tui/test/glitch.test.ts` | Tests for the glitch engine. |
| `cyber-glitch.tsx` | `packages/tui/src/component/cyber-glitch.tsx` | Mounts the glitch on the renderer's post-process pass. |
| `dialog-cyberpsycosis.tsx` | `packages/tui/src/component/dialog-cyberpsycosis.tsx` | The `/cyberpsycosis` level picker. |

## config/

| File | Target | Function |
|---|---|---|
| `capri.ts` | `packages/core/src/capri.ts` | Reads and writes `~/.config/capri/capri.json`: `cyberpsycosis` level, `glitchProbability` multiplier (default 1, 0 = off). |
| `capri-config.ts` | `packages/tui/src/capri-config.ts` | Reads `capri.json` for the TUI: `logo.style`, `hide.thinking`, `hide.toolResults`, `footer.name/model/tps`. |

## logo/

| File | Target | Function |
|---|---|---|
| `logo.ts` | `packages/tui/src/logo.ts` | Quadrant-block wordmark (the default character art). |
| `logo-halfblock.ts` | `packages/tui/src/logo-halfblock.ts` | Half-block wordmark. |
| `logo-image.ts` | `packages/tui/src/logo-image.ts` | Inline PNG for kitty/sixel terminals. |

Source masters and preview renders live in the git-ignored `capri_dev/`.

## theme/

| File | Target | Function |
|---|---|---|
| `capri-theme.json` | `packages/tui/src/theme/assets/v2/opencode.json` | Dark-only v2 TUI color theme (replaces the built-in v2 `opencode` theme). |

## tests/

| File | Target | Function |
|---|---|---|
| `capri-settings.ts` | `packages/tui/test/fixture/capri-settings.ts` | `whenModelShown`, `whenBuildLabelShown`, `whenTpsShown`, `whenThinkingShown`, `whenToolResultsShown`: `test`, or `test.skip` when capri.json hides what the test reads off the screen. |
| `*.test.tsx` | `packages/tui/test/` | Upstream tests switched to those helpers. To run them all, set `footer.name` to `"Build"`, `footer.model` and `footer.tps` to `true`, and `hide.thinking` and `hide.toolResults` to `false` in capri.json. |

## upstream/ (snapshots of edited opencode files)

| File | Target | Capri edit |
|---|---|---|
| `session-index.tsx` | `packages/tui/src/routes/session/index.tsx` | `ToolPart` hides tool output/diffs (`hide.toolResults`); `AssistantFooter` shows the Capri label, and model and tok/s only if enabled. |
| `message-parts.tsx` | `packages/tui/src/routes/session/message-parts.tsx` | `reasoningContent` scrambles thinking (`hide.thinking`). |
| `prompt-index.tsx` | `packages/tui/src/component/prompt/index.tsx` | Prompt box shows the Capri label, and model/provider/variant only if `footer.model`. |

## Edits to upstream files that are not copied here

| File | Change |
|---|---|
| `packages/core/src/session/system-prompt.ts` | Builds persona + active level + harness guidance. |
| `packages/core/src/session/runner/prompt/system.txt` | First line reworded; harness guidance kept. |
| `packages/core/src/plugin/optimize.ts` | `Plugins` is empty, so the model-family prompts are not used. |
| `packages/tui/src/app.tsx` | `/cyberpsycosis` command and the `<CyberGlitch />` mount. |
| `packages/core/test/*`, `packages/tui/test/*` | Tests updated for the Capri prompt and theme. |
