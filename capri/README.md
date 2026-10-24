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
├── skills/        on-demand skills (Cyberpunk lore)
├── install/       installer
├── docs/          project README
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
| `capri-config.ts` | `packages/tui/src/capri-config.ts` | Reads `capri.json` for the TUI: `logo.style`, `hide.thinking`, `hide.toolResults`, `hide.skills`, `footer.name/model/tps`. |

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

## skills/

On-demand skills for Capri. Only the skill name and one-line description sit in the default prompt; the body and the
references load when the model calls the `skill` tool and reads a file, so they cost tokens only when used.

| File | Target | Function |
|---|---|---|
| `cyberpunk-lore/SKILL.md` | `.opencode/skills/cyberpunk-lore/SKILL.md` | Entry point: when to load, accuracy rules, and a cheat sheet of the most-asked facts (world, corps, gangs, chrome, slang, S1/S2/2077 one-liners). |
| `cyberpunk-lore/references/characters.md` | `.opencode/skills/cyberpunk-lore/references/characters.md` | Who's who: Edgerunners 2 (D, Roman, Weak, Talia, Kyoko, Capri...), Edgerunners S1, and 2077. |
| `cyberpunk-lore/references/factions.md` | `.opencode/skills/cyberpunk-lore/references/factions.md` | Megacorps, NCPD/Max-Tac/Trauma Team, gangs table, nomads. |
| `cyberpunk-lore/references/places.md` | `.opencode/skills/cyberpunk-lore/references/places.md` | Night City districts and landmarks (Arasaka Tower, Afterlife...), Badlands, Moon, Net. |
| `cyberpunk-lore/references/tech.md` | `.opencode/skills/cyberpunk-lore/references/tech.md` | Chrome (Sandevistan, Mantis Blades...), cyberpsychosis, netrunning, braindance, slang. |
| `cyberpunk-lore/references/timeline.md` | `.opencode/skills/cyberpunk-lore/references/timeline.md` | History, S1 and Edgerunners 2 episode beats, 2077 plot. Sourced from cyberpunk.fandom.com; thin spots are marked "(thin)". |

## install/

| File | Target | Function |
|---|---|---|
| `install.sh` | `install` | Linux installer: downloads the release (or `--binary` for a local build), installs it as `~/.capri/bin/capri`, adds it to `PATH`, writes the default `~/.config/capri/capri.json` unless one exists, and installs the `capri/skills` files to `~/.config/opencode/skills/` (copied from a checkout, else fetched from the repo; rerun refreshes them). Replaces opencode's installer. |

## docs/

| File | Target | Function |
|---|---|---|
| `README.md` | `README.md` | Project README (English only): install, features, cyberpsychosis levels, `capri.json` options, opencode MIT attribution, NVIDIA NIM appendix. Replaces opencode's README. |

## upstream/ (snapshots of edited opencode files)

| File | Target | Capri edit |
|---|---|---|
| `session-index.tsx` | `packages/tui/src/routes/session/index.tsx` | `ToolPart` hides tool output/diffs (`hide.toolResults`); skill-load lines hidden (`hide.skills`); `AssistantFooter` shows the Capri label, and model and tok/s only if enabled. `/soulkiller` is an alias of `/compact`. OpenCode Go upsell dialog and notice removed. |
| `message-parts.tsx` | `packages/tui/src/routes/session/message-parts.tsx` | `reasoningContent` scrambles thinking (`hide.thinking`). |
| `app.tsx` | `packages/tui/src/app.tsx` | `/chrome` aliases `/models`, `/nightcity` aliases `/sessions`. `/update` command removed; terminal title is `Capri`. |
| `prompt-index.tsx` | `packages/tui/src/component/prompt/index.tsx` | Prompt box shows the Capri label, and model/provider/variant only if `footer.model`. `/quickhacks` aliases `/skills`. `/cd moon` quits (alias of `/exit`, even if `moon/` is missing). |
| `prompt-footer.tsx` | `packages/tui/src/feature-plugins/prompt/footer.tsx` | Removed the `shift+tab agents` hint. |
| `keybind.ts` | `packages/tui/src/config/keybind.ts` | `agent.cycle` default is `none` (no shift+tab switch to Plan). |
| `attention.ts` | `packages/tui/src/attention.ts` | Notification default title is `Capri`. |
| `mini-runtime-lifecycle.ts` | `packages/tui/src/mini/runtime.lifecycle.ts` | Mini-mode terminal title says `Capri`. |
| `cli-default.ts` | `packages/cli/src/commands/handlers/default.ts` | Background updater and the TUI `updater` hook removed, so Capri never self-updates to opencode. |
| `permission.tsx` | `packages/tui/src/routes/session/permission.tsx` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `mini-footer-permission.tsx` | `packages/tui/src/mini/footer.permission.tsx` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `error-component.tsx` | `packages/tui/src/component/error-component.tsx` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `terminal-pane.tsx` | `packages/tui/src/component/terminal-pane.tsx` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `mini-footer-prompt.tsx` | `packages/tui/src/mini/footer.prompt.tsx` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `error-details.ts` | `packages/tui/src/util/error-details.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `tui-config-index.tsx` | `packages/tui/src/config/index.tsx` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `sidebar-footer.tsx` | `packages/tui/src/feature-plugins/sidebar/footer.tsx` | Removed the "OpenCode includes free models" line. |
| `dialog-pair.tsx` | `packages/tui/src/component/dialog-pair.tsx` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `tui-error.ts` | `packages/tui/src/util/error.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `mini-splash.ts` | `packages/tui/src/mini/splash.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-commands.ts` | `packages/cli/src/commands/commands.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-pair.ts` | `packages/cli/src/commands/handlers/pair.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-uninstall.ts` | `packages/cli/src/commands/handlers/uninstall.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-upgrade.ts` | `packages/cli/src/commands/handlers/upgrade.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-stats.ts` | `packages/cli/src/commands/handlers/stats.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-acp-handler.ts` | `packages/cli/src/commands/handlers/acp.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-mcp-auth.ts` | `packages/cli/src/commands/handlers/mcp/auth.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-acp-service.ts` | `packages/cli/src/acp/service.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-acp-error.ts` | `packages/cli/src/acp/error.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-acp-translate.ts` | `packages/cli/src/acp/translate.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-mini.ts` | `packages/cli/src/mini.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-mini-host.ts` | `packages/cli/src/mini-host.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-server-process.ts` | `packages/cli/src/server-process.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-remote-tunnel.ts` | `packages/cli/src/services/remote-tunnel.ts` | OpenCode wording replaced with Capri (`opencode <cmd>` hints are now `capri <cmd>`). |
| `cli-build.ts` | `packages/cli/script/build.ts` | `OPENCODE_CLI_NAME` is `capri`, so `--version` and help say `capri`. |

## Edits to upstream files that are not copied here

| File | Change |
|---|---|
| `packages/core/src/session/system-prompt.ts` | Builds persona + active level + harness guidance. |
| `packages/core/src/session/runner/prompt/system.txt` | First line reworded; harness guidance kept. |
| `packages/core/src/plugin/optimize.ts` | `Plugins` is empty, so the model-family prompts are not used. |
| `packages/tui/src/app.tsx` | `/cyberpsycosis` command and the `<CyberGlitch />` mount. |
| `LICENSE` | Added the original opencode copyright line (MIT). |
| `README.*.md` (translations) | Deleted with opencode's README. |
| `packages/core/test/*`, `packages/tui/test/*` | Tests updated for the Capri prompt and theme. |
