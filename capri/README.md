# capri/

Capri customizations, developed here first and then copied over the designated upstream files.

| File | Function |
|---|---|
| `capri-theme.json` | Dark-only v2 TUI color theme. Target: `packages/tui/src/theme/assets/` (or `.opencode/themes/` for local use). |
| `CAPRI.md` | Capri persona system prompt (personality, background, voice, behavior limits). Copied by `sync-prompts.sh` into the core prompt dir (applies to every model family); text below the `---` line is the prompt. |
| `cyberpsycosis-none.md`, `cyberpsycosis-medium.md`, `cyberpsycosis-max.md` | Tunable "cyberpsychosis" modules appended after `CAPRI.md`. none = voice only; medium = recoverable pranks; max = destructive pranks. Effects table: `capri_dev/cyberpsycosis-levels-summary.md`. |
| `sync-prompts.sh` | Copies `CAPRI.md` and `cyberpsycosis-*.md` (minus their headers) into `packages/core/src/session/runner/prompt/capri/*.txt`. Run it after editing any prompt. `packages/core/src/session/system-prompt.ts` assembles persona + active level + harness guidance; the TUI `/cyberpsycosis` command (`packages/tui/src/component/dialog-cyberpsycosis.tsx`) sets the level. |
| `capri-logo.ts` | Half-block wordmark. Target: `packages/tui/src/logo.ts`. |
| `capri-logo-tui-large.png`, `capri-logo-tui-small.png` | Logo reference renders. |
