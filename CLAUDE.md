# Capri (opencode fork)

Capri-themed fork of opencode (Bun + TypeScript + Effect monorepo, v2.x, default branch `dev`).
Goal: Capri (Cyberpunk: Edgerunners S2 AI) branding — icon/logo, color theme, and a system prompt
that makes the model mock its accent. **Current slice: Linux CLI/TUI only.** Desktop and VS Code are later slices.

See `AGENTS.md` for upstream style/workflow rules (Effect patterns, theme-token rules, commit format). Follow them.

## Commands

- `bun install`
- `bun run dev` — run CLI/TUI from source (`packages/cli/src/index.ts`)
- `bun run typecheck` / `bun run lint` / `bun run check`
- Tests: run from the package dir, never from root (root `test` intentionally fails)
- Build binary: `bun run build` in `packages/cli` (`script/build.ts`)

## Layout — IN SCOPE (CLI slice)

| Path                                                                                                                       | Role                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/cli`                                                                                                             | Entry point; `bin/opencode.cjs`; `src/commands`, `src/run`, `src/ui`, build scripts                                                                                                 |
| `packages/tui`                                                                                                             | Terminal UI (OpenTUI + Solid). Logo: `src/logo.ts`, `src/component/logo.tsx`, `src/mini/splash.ts`, `src/routes/home.tsx`. Themes: `src/theme/` (+ `assets/*.json` built-in themes) |
| `packages/theme`                                                                                                           | Theme schema/resolution (`src/tui/*`: schema, resolve, expand, v1 migration)                                                                                                        |
| `packages/core`                                                                                                            | Agent runtime: sessions, providers, tools, permissions, config, MCP, plugins                                                                                                        |
| `packages/core/src/plugin/system-prompt/*.txt`                                                                             | Per-model-family system prompts (anthropic, gpt, kimi, meta, trinity…) — **main hook for the Capri accent prompt**                                                                  |
| `packages/core/src/session/runner/prompt/system.txt`                                                                       | Base session system prompt                                                                                                                                                          |
| `packages/core/src/agent.ts`, `session/instructions.ts`                                                                    | Agent definitions / instruction assembly                                                                                                                                            |
| `packages/server`, `packages/protocol`, `packages/schema`, `packages/client`, `packages/sdk`                               | HTTP API, shared schemas, generated client (don't hand-edit generated client; run `bun run generate` in `packages/client`)                                                          |
| `packages/plugin`, `packages/plugins`                                                                                      | Plugin API and bundled plugins                                                                                                                                                      |
| `packages/ai`, `packages/util`, `packages/codemode`, `packages/merman`, `packages/latex`, `packages/effect-drizzle-sqlite` | LLM provider layer and support libs                                                                                                                                                 |
| `packages/script`, `packages/http-recorder`, `packages/httpapi-codegen`, `packages/simulation`                             | Build/test tooling                                                                                                                                                                  |
| `.opencode/`                                                                                                               | Project-local opencode config: `opencode.jsonc`, `tui.json`, `themes/` (custom theme example `mytheme.json`), agents, skills, commands                                              |
| `script/`                                                                                                                  | Repo-level scripts (release, lint, ast-grep rules)                                                                                                                                  |
| `install`                                                                                                                  | Upstream curl installer script                                                                                                                                                      |

Dependency direction: Schema → Core/Protocol → Server; Client depends only on Schema/Protocol; `sdk` composes all.

## Layout — OUT OF SCOPE (git-ignored via `.gitignore`)

Later slices: `sdks/vscode`, `packages/desktop`, `packages/app`, `packages/ui`, `packages/session-ui`, `packages/gui-extensions`, `packages/plugin-browser`, `packages/storybook`.
Irrelevant: `packages/web`, `console`, `stats`, `posts`, `function`, `containers`, `identity`, `services/`, `infra/`, `github/`, `salesforce/`, `nix/`, `flake.*`, `sst*`, translated `README.*.md`, `CHANGELOG.md`, `STATS.md`, audit docs.
Note: these were already tracked upstream, so `.gitignore` only hides new/untracked files; they still exist in the working tree and in git. To hide them from `git status` fully, use `git rm -r --cached`, or just don't search them. Re-enable a slice by deleting its line in `.gitignore`.

## Capri customization map

- **Logo/icon**: `component/logo.tsx` picks a renderer: inline PNG (`logo-image.ts`, kitty/sixel terminals; flattened onto the theme background because sixel has no alpha), quadrant-block art (`logo.ts`), or half-block art (`logo-halfblock.ts`). Art is stored as rows of `[text, fg, bg]` runs indexing a palette. Source SVG/PNG masters live in `capri_dev/` (git-ignored). The exit-screen wordmark is in `util/presentation.ts`. `mini/splash.ts` still uses opencode's `go` art.
- **Capri settings**: `packages/tui/src/capri-config.ts` reads `capri.json` from `~/.config/capri/capri.json` (honors `XDG_CONFIG_HOME`), jsonc, shaped like tui.json but for Capri-only options. Currently `{ "logo": { "style": "auto" | "image" | "quadrant" | "halfblock" } }`. Env `CAPRI_LOGO` overrides the file. Add new Capri options to `Info` there.
- **Color theme**: add a built-in JSON in `packages/tui/src/theme/assets/` (follow existing, e.g. `cursor.json`/`dracula.json`) and register it per `theme/system.ts`/`index.ts`; token rules in `AGENTS.md` (use semantic tokens only). User-level custom themes go in `.opencode/themes/`.
- **Accent-mocking prompt**: edit/add text in `packages/core/src/plugin/system-prompt/*.txt` (one per model family — a persona must be applied to all) or via `instructions`/agent prompt in `.opencode/agent/`.
- **Naming/binary**: `packages/cli/package.json` `bin`, `bin/opencode.cjs`, build in `packages/cli/script/build.ts`.

## Workspace

- All customized changes should be implemented first inside `capri/` folder, and then copied and replaced the designated files. 

- A dedicated README inside `capri/` records the function of each files.

- A workspace called `capri_dev/` stores working drafts, components. Inside `.gitignore` .  
