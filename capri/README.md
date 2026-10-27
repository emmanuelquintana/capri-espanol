# Capri en español · Fuentes propias del fork

Repositorio mantenido en `emmanuelquintana/capri-espanol`. `project.json` declara nuestra identidad y versión. `build-release.ps1` compila y empaqueta esta distribución; `install/Instalar-Capri.cmd` instala o descarga nuestras publicaciones.

`friendly/` contiene la nueva experiencia: `config.ts` define el perfil y las preferencias y usa `capri.character.json` para construir las instrucciones del personaje; `server.ts` limita el acceso al motor nativo; `amigable.ts` arranca la aplicación; los tres archivos de texto incluyen HTML, CSS y JavaScript; `friendly.test.ts` comprueba la ficha, aislamiento, credenciales y conversaciones.

`tests/installer-gui.test.ps1` pulsa el botón real del instalador en una carpeta temporal y comprueba progreso e integridad. `docs/REFERENCIAS-COMPARADAS.md` documenta los proyectos de referencia, las decisiones y las etapas pendientes; `docs/referencias-revisiones.json` fija las revisiones consultadas.

`automation/capri-espanol.yml` es el único flujo activo propio. `legacy-workflows/` conserva los flujos heredados de `.github/workflows/` como referencia; no se sincronizan de vuelta ni se ejecutan. `docs/GUIA-AMIGABLE.md`, `docs/VALIDACION-AMIGABLE.md` y `docs/NOTICE.md` documentan el producto, sus verificaciones y su procedencia. `docs/qa/amigable/` conserva capturas de pruebas con un proveedor simulado.

Las fuentes canónicas se mantienen aquí y se copian a sus destinos con `bash capri/sync.sh`. Tras integrar cambios del proyecto original, usa `bash capri/sync.sh from-repo` para actualizar las copias antes de editarlas. Los prompts se generan quitando su cabecera hasta la primera línea `---`.

Base Capri: `7160631f275a8fae32462a511624cae20d85b05e`. Dependencias recuperadas: OpenCode `v2.1.4`, revisión `68bc26b7da1990ce10ffecfbc1e09eb13aa5d824`. Consulta [el análisis](docs/INGENIERIA_INVERSA.md), [la validación](docs/VALIDACION.md) y [el origen de dependencias](vendor/ORIGEN.md).

## Personalidad y traducción

- `prompts/CAPRI.md`: personaje y español latinoamericano por defecto; genera `packages/core/src/session/runner/prompt/capri/persona.txt`.
- `prompts/cyberpsycosis-{none,low,medium,max}.md`: instrucciones de cada nivel; generan los cuatro archivos del mismo nombre en la carpeta de prompts de ejecución. Todos respetan archivos, secretos y decisiones del usuario.
- `localization/es.tsv`: catálogo de textos originales y traducciones. Es un registro de traducción; los archivos fuente contienen las cadenas finales.
- `localization/persona.es.md`, `levels.es.json` y `lore.es.md`: materiales españoles usados para preparar el personaje, los niveles y la habilidad.
- `localization/files.json`: inventario legible por herramientas de las copias y sus funciones.
- `docs/README.md`: instrucciones del proyecto; `LEEME-PAQUETE.md`: instrucciones del ZIP; `INGENIERIA_INVERSA.md`: arquitectura; `VALIDACION.md`: pruebas y límites; `docs/qa/`: capturas y registros breves.
- `sync.sh`: sincroniza los archivos siguientes y genera los prompts.

Los comandos, protocolos, valores de configuración y nombres de modelos conservan sus identificadores originales. La revisión automática rechazó las instrucciones originales de sabotaje del personaje; se conservan el tono y los efectos sin esas instrucciones.

## Mapa completo de archivos sincronizados

| Fuente en capri/ | Destino | Función |
| --- | --- | --- |
| `friendly/capri.character.json` | `packages/cli/src/friendly/capri.character.json` | Ficha propia del personaje usada por las instrucciones del chat; formato Character Card V2 |
| `logo/logo.ts` | `packages/tui/src/logo.ts` | Logo y representación de marca |
| `install/install.sh` | `install` | Instalador local de la edición española |
| `install/install.ps1` | `install.ps1` | Instalador local de la edición española |
| `docs/README.md` | `README.md` | Instrucciones principales en español |
| `theme/capri-theme.json` | `packages/tui/src/theme/assets/v2/opencode.json` | Tema visual de Capri |
| `config/capri.ts` | `packages/core/src/capri.ts` | Configuración del personaje y la terminal |
| `config/capri-config.ts` | `packages/tui/src/capri-config.ts` | Configuración del personaje y la terminal |
| `glitch/glitch.ts` | `packages/tui/src/glitch.ts` | Efectos visuales y selector de nivel |
| `glitch/glitch.test.ts` | `packages/tui/test/glitch.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `glitch/cyber-glitch.tsx` | `packages/tui/src/component/cyber-glitch.tsx` | Efectos visuales y selector de nivel |
| `glitch/dialog-cyberpsycosis.tsx` | `packages/tui/src/component/dialog-cyberpsycosis.tsx` | Efectos visuales y selector de nivel |
| `logo/logo-halfblock.ts` | `packages/tui/src/logo-halfblock.ts` | Logo y representación de marca |
| `logo/logo-image.ts` | `packages/tui/src/logo-image.ts` | Logo y representación de marca |
| `upstream/session-index.tsx` | `packages/tui/src/routes/session/index.tsx` | Copia del código adaptado: packages/tui/src/routes/session/index.tsx |
| `upstream/message-parts.tsx` | `packages/tui/src/routes/session/message-parts.tsx` | Copia del código adaptado: packages/tui/src/routes/session/message-parts.tsx |
| `upstream/prompt-index.tsx` | `packages/tui/src/component/prompt/index.tsx` | Copia del código adaptado: packages/tui/src/component/prompt/index.tsx |
| `upstream/app.tsx` | `packages/tui/src/app.tsx` | Copia del código adaptado: packages/tui/src/app.tsx |
| `upstream/prompt-footer.tsx` | `packages/tui/src/feature-plugins/prompt/footer.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/prompt/footer.tsx |
| `upstream/keybind.ts` | `packages/tui/src/config/keybind.ts` | Copia del código adaptado: packages/tui/src/config/keybind.ts |
| `upstream/attention.ts` | `packages/tui/src/attention.ts` | Copia del código adaptado: packages/tui/src/attention.ts |
| `upstream/mini-runtime-lifecycle.ts` | `packages/tui/src/mini/runtime.lifecycle.ts` | Copia del código adaptado: packages/tui/src/mini/runtime.lifecycle.ts |
| `upstream/cli-default.ts` | `packages/cli/src/commands/handlers/default.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/default.ts |
| `upstream/permission.tsx` | `packages/tui/src/routes/session/permission.tsx` | Copia del código adaptado: packages/tui/src/routes/session/permission.tsx |
| `upstream/mini-footer-permission.tsx` | `packages/tui/src/mini/footer.permission.tsx` | Copia del código adaptado: packages/tui/src/mini/footer.permission.tsx |
| `upstream/error-component.tsx` | `packages/tui/src/component/error-component.tsx` | Copia del código adaptado: packages/tui/src/component/error-component.tsx |
| `upstream/terminal-pane.tsx` | `packages/tui/src/component/terminal-pane.tsx` | Copia del código adaptado: packages/tui/src/component/terminal-pane.tsx |
| `upstream/mini-footer-prompt.tsx` | `packages/tui/src/mini/footer.prompt.tsx` | Copia del código adaptado: packages/tui/src/mini/footer.prompt.tsx |
| `upstream/error-details.ts` | `packages/tui/src/util/error-details.ts` | Copia del código adaptado: packages/tui/src/util/error-details.ts |
| `upstream/tui-config-index.tsx` | `packages/tui/src/config/index.tsx` | Copia del código adaptado: packages/tui/src/config/index.tsx |
| `upstream/sidebar-footer.tsx` | `packages/tui/src/feature-plugins/sidebar/footer.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/sidebar/footer.tsx |
| `upstream/dialog-pair.tsx` | `packages/tui/src/component/dialog-pair.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-pair.tsx |
| `upstream/tui-error.ts` | `packages/tui/src/util/error.ts` | Copia del código adaptado: packages/tui/src/util/error.ts |
| `upstream/mini-splash.ts` | `packages/tui/src/mini/splash.ts` | Copia del código adaptado: packages/tui/src/mini/splash.ts |
| `upstream/cli-commands.ts` | `packages/cli/src/commands/commands.ts` | Copia del código adaptado: packages/cli/src/commands/commands.ts |
| `upstream/cli-pair.ts` | `packages/cli/src/commands/handlers/pair.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/pair.ts |
| `upstream/cli-uninstall.ts` | `packages/cli/src/commands/handlers/uninstall.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/uninstall.ts |
| `upstream/cli-upgrade.ts` | `packages/cli/src/commands/handlers/upgrade.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/upgrade.ts |
| `upstream/cli-stats.ts` | `packages/cli/src/commands/handlers/stats.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/stats.ts |
| `upstream/cli-acp-handler.ts` | `packages/cli/src/commands/handlers/acp.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/acp.ts |
| `upstream/cli-mcp-auth.ts` | `packages/cli/src/commands/handlers/mcp/auth.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/mcp/auth.ts |
| `upstream/cli-acp-service.ts` | `packages/cli/src/acp/service.ts` | Copia del código adaptado: packages/cli/src/acp/service.ts |
| `upstream/cli-acp-error.ts` | `packages/cli/src/acp/error.ts` | Copia del código adaptado: packages/cli/src/acp/error.ts |
| `upstream/cli-acp-translate.ts` | `packages/cli/src/acp/translate.ts` | Copia del código adaptado: packages/cli/src/acp/translate.ts |
| `upstream/cli-mini.ts` | `packages/cli/src/mini.ts` | Copia del código adaptado: packages/cli/src/mini.ts |
| `upstream/cli-mini-host.ts` | `packages/cli/src/mini-host.ts` | Copia del código adaptado: packages/cli/src/mini-host.ts |
| `upstream/cli-server-process.ts` | `packages/cli/src/server-process.ts` | Copia del código adaptado: packages/cli/src/server-process.ts |
| `upstream/cli-remote-tunnel.ts` | `packages/cli/src/services/remote-tunnel.ts` | Copia del código adaptado: packages/cli/src/services/remote-tunnel.ts |
| `upstream/cli-build.ts` | `packages/cli/script/build.ts` | Copia del código adaptado: packages/cli/script/build.ts |
| `skills/cyberpunk-lore/SKILL.md` | `.opencode/skills/cyberpunk-lore/SKILL.md` | Habilidad de lore y sus referencias originales |
| `skills/cyberpunk-lore/references/characters.md` | `.opencode/skills/cyberpunk-lore/references/characters.md` | Habilidad de lore y sus referencias originales |
| `skills/cyberpunk-lore/references/factions.md` | `.opencode/skills/cyberpunk-lore/references/factions.md` | Habilidad de lore y sus referencias originales |
| `skills/cyberpunk-lore/references/places.md` | `.opencode/skills/cyberpunk-lore/references/places.md` | Habilidad de lore y sus referencias originales |
| `skills/cyberpunk-lore/references/tech.md` | `.opencode/skills/cyberpunk-lore/references/tech.md` | Habilidad de lore y sus referencias originales |
| `skills/cyberpunk-lore/references/timeline.md` | `.opencode/skills/cyberpunk-lore/references/timeline.md` | Habilidad de lore y sus referencias originales |
| `skills/cyberpunk-lore/references/slang.md` | `.opencode/skills/cyberpunk-lore/references/slang.md` | Habilidad de lore y sus referencias originales |
| `tests/capri-settings.ts` | `packages/tui/test/fixture/capri-settings.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/app-lifecycle.test.tsx` | `packages/tui/test/app-lifecycle.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/command-selection.test.tsx` | `packages/tui/test/command-selection.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/compact-admission.test.tsx` | `packages/tui/test/compact-admission.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/new-session-id.test.tsx` | `packages/tui/test/new-session-id.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/prompt-shell-failure.test.tsx` | `packages/tui/test/prompt-shell-failure.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/session-panel.test.tsx` | `packages/tui/test/session-panel.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/session-backfill-disclosure.test.tsx` | `packages/tui/test/session-backfill-disclosure.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/session-group-navigation.test.tsx` | `packages/tui/test/session-group-navigation.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/session-activity-anchor.test.tsx` | `packages/tui/test/session-activity-anchor.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `tests/group-view.test.tsx` | `packages/tui/test/cli/tui/group-view.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `config/gitignore` | `.gitignore` | Exclusiones de compilación y dependencias recuperadas |
| `config/bun.lock` | `bun.lock` | Resolución reproducible de dependencias |
| `upstream/cli/src/acp/catalog.ts` | `packages/cli/src/acp/catalog.ts` | Copia del código adaptado: packages/cli/src/acp/catalog.ts |
| `upstream/cli/src/acp/elicitation.ts` | `packages/cli/src/acp/elicitation.ts` | Copia del código adaptado: packages/cli/src/acp/elicitation.ts |
| `upstream/cli/src/commands/handlers/api.test.ts` | `packages/cli/src/commands/handlers/api.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/src/commands/handlers/auth/account.ts` | `packages/cli/src/commands/handlers/auth/account.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/auth/account.ts |
| `upstream/cli/src/commands/handlers/auth/form.ts` | `packages/cli/src/commands/handlers/auth/form.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/auth/form.ts |
| `upstream/cli/src/commands/handlers/auth/login.ts` | `packages/cli/src/commands/handlers/auth/login.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/auth/login.ts |
| `upstream/cli/src/commands/handlers/auth/logout.ts` | `packages/cli/src/commands/handlers/auth/logout.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/auth/logout.ts |
| `upstream/cli/src/commands/handlers/auth/switch.ts` | `packages/cli/src/commands/handlers/auth/switch.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/auth/switch.ts |
| `upstream/cli/src/commands/handlers/mcp/list.ts` | `packages/cli/src/commands/handlers/mcp/list.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/mcp/list.ts |
| `upstream/cli/src/commands/handlers/plugin/inventory.ts` | `packages/cli/src/commands/handlers/plugin/inventory.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/plugin/inventory.ts |
| `upstream/cli/src/commands/handlers/plugin/list.ts` | `packages/cli/src/commands/handlers/plugin/list.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/plugin/list.ts |
| `upstream/cli/src/commands/handlers/reload.ts` | `packages/cli/src/commands/handlers/reload.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/reload.ts |
| `upstream/cli/src/commands/handlers/session/export.ts` | `packages/cli/src/commands/handlers/session/export.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/session/export.ts |
| `upstream/cli/src/commands/handlers/session/list.ts` | `packages/cli/src/commands/handlers/session/list.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/session/list.ts |
| `upstream/cli/src/framework/runtime.ts` | `packages/cli/src/framework/runtime.ts` | Copia del código adaptado: packages/cli/src/framework/runtime.ts |
| `upstream/cli/src/framework/spanish.ts` | `packages/cli/src/framework/spanish.ts` | Copia del código adaptado: packages/cli/src/framework/spanish.ts |
| `upstream/cli/src/run/noninteractive.ts` | `packages/cli/src/run/noninteractive.ts` | Copia del código adaptado: packages/cli/src/run/noninteractive.ts |
| `upstream/cli/src/run/run.ts` | `packages/cli/src/run/run.ts` | Copia del código adaptado: packages/cli/src/run/run.ts |
| `upstream/cli/src/run/v1.ts` | `packages/cli/src/run/v1.ts` | Copia del código adaptado: packages/cli/src/run/v1.ts |
| `upstream/cli/src/services/server-connection.ts` | `packages/cli/src/services/server-connection.ts` | Copia del código adaptado: packages/cli/src/services/server-connection.ts |
| `upstream/cli/src/services/service-config.ts` | `packages/cli/src/services/service-config.ts` | Copia del código adaptado: packages/cli/src/services/service-config.ts |
| `upstream/cli/src/services/updater.test.ts` | `packages/cli/src/services/updater.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/src/session-target.ts` | `packages/cli/src/session-target.ts` | Copia del código adaptado: packages/cli/src/session-target.ts |
| `upstream/cli/src/ssh-askpass.test.ts` | `packages/cli/src/ssh-askpass.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/src/ui/integration-picker.ts` | `packages/cli/src/ui/integration-picker.ts` | Copia del código adaptado: packages/cli/src/ui/integration-picker.ts |
| `upstream/cli/src/ui/prompt.ts` | `packages/cli/src/ui/prompt.ts` | Copia del código adaptado: packages/cli/src/ui/prompt.ts |
| `upstream/cli/test/acp/additional-directories.subprocess.test.ts` | `packages/cli/test/acp/additional-directories.subprocess.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/additional-directories.test.ts` | `packages/cli/test/acp/additional-directories.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/catalog.test.ts` | `packages/cli/test/acp/catalog.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/compaction.test.ts` | `packages/cli/test/acp/compaction.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/config-option.test.ts` | `packages/cli/test/acp/config-option.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/elicitation.test.ts` | `packages/cli/test/acp/elicitation.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/error.test.ts` | `packages/cli/test/acp/error.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/lifecycle.subprocess.test.ts` | `packages/cli/test/acp/lifecycle.subprocess.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/permission.test.ts` | `packages/cli/test/acp/permission.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/prompt-content.subprocess.test.ts` | `packages/cli/test/acp/prompt-content.subprocess.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/prompt.test.ts` | `packages/cli/test/acp/prompt.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/replay.test.ts` | `packages/cli/test/acp/replay.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/session.test.ts` | `packages/cli/test/acp/session.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/subprocess.ts` | `packages/cli/test/acp/subprocess.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/translate.test.ts` | `packages/cli/test/acp/translate.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/turn.test.ts` | `packages/cli/test/acp/turn.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/acp/wire-fixture.ts` | `packages/cli/test/acp/wire-fixture.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/app-archive.test.ts` | `packages/cli/test/app-archive.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/auth-form.test.ts` | `packages/cli/test/auth-form.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/auth-login-choices.test.ts` | `packages/cli/test/auth-login-choices.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/auth.test.ts` | `packages/cli/test/auth.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/config.test.ts` | `packages/cli/test/config.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/cors.test.ts` | `packages/cli/test/cors.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/cpu-profile.test.ts` | `packages/cli/test/cpu-profile.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/debug-config.test.ts` | `packages/cli/test/debug-config.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/debug-heap-dump.test.ts` | `packages/cli/test/debug-heap-dump.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/debug-paths.test.ts` | `packages/cli/test/debug-paths.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/env.test.ts` | `packages/cli/test/env.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/import-boundaries.test.ts` | `packages/cli/test/import-boundaries.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/import-export.test.ts` | `packages/cli/test/import-export.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/mcp-auth-choices.test.ts` | `packages/cli/test/mcp-auth-choices.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/mini-config.test.ts` | `packages/cli/test/mini-config.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/mini-host.test.ts` | `packages/cli/test/mini-host.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/mini-timeout.test.ts` | `packages/cli/test/mini-timeout.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/mini.test.ts` | `packages/cli/test/mini.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/node-assets.test.ts` | `packages/cli/test/node-assets.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/pair-remote-consent.test.ts` | `packages/cli/test/pair-remote-consent.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/prompt-open-url.test.ts` | `packages/cli/test/prompt-open-url.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/retained-image.test.ts` | `packages/cli/test/retained-image.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/run/noninteractive.test.ts` | `packages/cli/test/run/noninteractive.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/server-connection.test.ts` | `packages/cli/test/server-connection.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/service-lifecycle.test.ts` | `packages/cli/test/service-lifecycle.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/service.test.ts` | `packages/cli/test/service.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/session-target.test.ts` | `packages/cli/test/session-target.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/spanish.test.ts` | `packages/cli/test/spanish.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/standalone.test.ts` | `packages/cli/test/standalone.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/stats.test.ts` | `packages/cli/test/stats.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/updater-install.test.ts` | `packages/cli/test/updater-install.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/upgrade.test.ts` | `packages/cli/test/upgrade.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/vite-refresh.test.ts` | `packages/cli/test/vite-refresh.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/vite-route.test.tsx` | `packages/cli/test/vite-route.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli/test/web-ui.test.ts` | `packages/cli/test/web-ui.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/core/test/session-system-prompt.test.ts` | `packages/core/test/session-system-prompt.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `vendor/plugin-browser/README.md` | `packages/plugin-browser/README.md` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/package.json` | `packages/plugin-browser/package.json` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/script/publish.ts` | `packages/plugin-browser/script/publish.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/src/connection.ts` | `packages/plugin-browser/src/connection.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/src/files.ts` | `packages/plugin-browser/src/files.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/src/index.ts` | `packages/plugin-browser/src/index.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/src/proxy.ts` | `packages/plugin-browser/src/proxy.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/src/rpc.ts` | `packages/plugin-browser/src/rpc.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/src/tools.ts` | `packages/plugin-browser/src/tools.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/src/tunnel.ts` | `packages/plugin-browser/src/tunnel.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/test/rpc.test.ts` | `packages/plugin-browser/test/rpc.test.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/test/tools.test.ts` | `packages/plugin-browser/test/tools.test.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/test/tunnel.test.ts` | `packages/plugin-browser/test/tunnel.test.ts` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/tsconfig.build.json` | `packages/plugin-browser/tsconfig.build.json` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/tsconfig.json` | `packages/plugin-browser/tsconfig.json` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/plugin-browser/tsconfig.test.json` | `packages/plugin-browser/tsconfig.test.json` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `upstream/tui/src/component/command-palette.tsx` | `packages/tui/src/component/command-palette.tsx` | Copia del código adaptado: packages/tui/src/component/command-palette.tsx |
| `upstream/tui/src/component/devtools-bar.tsx` | `packages/tui/src/component/devtools-bar.tsx` | Copia del código adaptado: packages/tui/src/component/devtools-bar.tsx |
| `upstream/tui/src/component/dialog-agent.tsx` | `packages/tui/src/component/dialog-agent.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-agent.tsx |
| `upstream/tui/src/component/dialog-config.tsx` | `packages/tui/src/component/dialog-config.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-config.tsx |
| `upstream/tui/src/component/dialog-debug.tsx` | `packages/tui/src/component/dialog-debug.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-debug.tsx |
| `upstream/tui/src/component/dialog-error-details.tsx` | `packages/tui/src/component/dialog-error-details.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-error-details.tsx |
| `upstream/tui/src/component/dialog-experiments.tsx` | `packages/tui/src/component/dialog-experiments.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-experiments.tsx |
| `upstream/tui/src/component/dialog-go-upsell.tsx` | `packages/tui/src/component/dialog-go-upsell.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-go-upsell.tsx |
| `upstream/tui/src/component/dialog-highlights.tsx` | `packages/tui/src/component/dialog-highlights.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-highlights.tsx |
| `upstream/tui/src/component/dialog-image-preview.tsx` | `packages/tui/src/component/dialog-image-preview.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-image-preview.tsx |
| `upstream/tui/src/component/dialog-integration.tsx` | `packages/tui/src/component/dialog-integration.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-integration.tsx |
| `upstream/tui/src/component/dialog-mcp.tsx` | `packages/tui/src/component/dialog-mcp.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-mcp.tsx |
| `upstream/tui/src/component/dialog-model-free.tsx` | `packages/tui/src/component/dialog-model-free.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-model-free.tsx |
| `upstream/tui/src/component/dialog-model.tsx` | `packages/tui/src/component/dialog-model.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-model.tsx |
| `upstream/tui/src/component/dialog-open.tsx` | `packages/tui/src/component/dialog-open.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-open.tsx |
| `upstream/tui/src/component/dialog-session-list.tsx` | `packages/tui/src/component/dialog-session-list.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-session-list.tsx |
| `upstream/tui/src/component/dialog-session-rename.tsx` | `packages/tui/src/component/dialog-session-rename.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-session-rename.tsx |
| `upstream/tui/src/component/dialog-shell-output.tsx` | `packages/tui/src/component/dialog-shell-output.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-shell-output.tsx |
| `upstream/tui/src/component/dialog-skill.tsx` | `packages/tui/src/component/dialog-skill.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-skill.tsx |
| `upstream/tui/src/component/dialog-stash.tsx` | `packages/tui/src/component/dialog-stash.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-stash.tsx |
| `upstream/tui/src/component/dialog-status.tsx` | `packages/tui/src/component/dialog-status.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-status.tsx |
| `upstream/tui/src/component/dialog-theme-list.tsx` | `packages/tui/src/component/dialog-theme-list.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-theme-list.tsx |
| `upstream/tui/src/component/dialog-update.tsx` | `packages/tui/src/component/dialog-update.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-update.tsx |
| `upstream/tui/src/component/dialog-variant.tsx` | `packages/tui/src/component/dialog-variant.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-variant.tsx |
| `upstream/tui/src/component/dialog-workspace-file-changes.tsx` | `packages/tui/src/component/dialog-workspace-file-changes.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-workspace-file-changes.tsx |
| `upstream/tui/src/component/dialog-workspaces.tsx` | `packages/tui/src/component/dialog-workspaces.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-workspaces.tsx |
| `upstream/tui/src/component/dialog-worktree-name.tsx` | `packages/tui/src/component/dialog-worktree-name.tsx` | Copia del código adaptado: packages/tui/src/component/dialog-worktree-name.tsx |
| `upstream/tui/src/component/migration-overlay.tsx` | `packages/tui/src/component/migration-overlay.tsx` | Copia del código adaptado: packages/tui/src/component/migration-overlay.tsx |
| `upstream/tui/src/component/plugin-route-missing.tsx` | `packages/tui/src/component/plugin-route-missing.tsx` | Copia del código adaptado: packages/tui/src/component/plugin-route-missing.tsx |
| `upstream/tui/src/component/prompt/autocomplete.tsx` | `packages/tui/src/component/prompt/autocomplete.tsx` | Copia del código adaptado: packages/tui/src/component/prompt/autocomplete.tsx |
| `upstream/tui/src/component/prompt/local-attachment.ts` | `packages/tui/src/component/prompt/local-attachment.ts` | Copia del código adaptado: packages/tui/src/component/prompt/local-attachment.ts |
| `upstream/tui/src/component/prompt/metadata.tsx` | `packages/tui/src/component/prompt/metadata.tsx` | Copia del código adaptado: packages/tui/src/component/prompt/metadata.tsx |
| `upstream/tui/src/component/prompt/move.tsx` | `packages/tui/src/component/prompt/move.tsx` | Copia del código adaptado: packages/tui/src/component/prompt/move.tsx |
| `upstream/tui/src/component/reconnecting.tsx` | `packages/tui/src/component/reconnecting.tsx` | Copia del código adaptado: packages/tui/src/component/reconnecting.tsx |
| `upstream/tui/src/component/session-frame.tsx` | `packages/tui/src/component/session-frame.tsx` | Copia del código adaptado: packages/tui/src/component/session-frame.tsx |
| `upstream/tui/src/component/session-tabs.tsx` | `packages/tui/src/component/session-tabs.tsx` | Copia del código adaptado: packages/tui/src/component/session-tabs.tsx |
| `upstream/tui/src/component/startup-loading.tsx` | `packages/tui/src/component/startup-loading.tsx` | Copia del código adaptado: packages/tui/src/component/startup-loading.tsx |
| `upstream/tui/src/component/theme-error-toast.tsx` | `packages/tui/src/component/theme-error-toast.tsx` | Copia del código adaptado: packages/tui/src/component/theme-error-toast.tsx |
| `upstream/tui/src/config/v1/index.tsx` | `packages/tui/src/config/v1/index.tsx` | Copia del código adaptado: packages/tui/src/config/v1/index.tsx |
| `upstream/tui/src/config/v1/keybind.ts` | `packages/tui/src/config/v1/keybind.ts` | Copia del código adaptado: packages/tui/src/config/v1/keybind.ts |
| `upstream/tui/src/context/local.tsx` | `packages/tui/src/context/local.tsx` | Copia del código adaptado: packages/tui/src/context/local.tsx |
| `upstream/tui/src/context/program-status.ts` | `packages/tui/src/context/program-status.ts` | Copia del código adaptado: packages/tui/src/context/program-status.ts |
| `upstream/tui/src/context/session-tabs-model.ts` | `packages/tui/src/context/session-tabs-model.ts` | Copia del código adaptado: packages/tui/src/context/session-tabs-model.ts |
| `upstream/tui/src/context/session-tabs.tsx` | `packages/tui/src/context/session-tabs.tsx` | Copia del código adaptado: packages/tui/src/context/session-tabs.tsx |
| `upstream/tui/src/context/theme.tsx` | `packages/tui/src/context/theme.tsx` | Copia del código adaptado: packages/tui/src/context/theme.tsx |
| `upstream/tui/src/editor.ts` | `packages/tui/src/editor.ts` | Copia del código adaptado: packages/tui/src/editor.ts |
| `upstream/tui/src/feature-plugins/home/footer.tsx` | `packages/tui/src/feature-plugins/home/footer.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/home/footer.tsx |
| `upstream/tui/src/feature-plugins/prompt/btw.tsx` | `packages/tui/src/feature-plugins/prompt/btw.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/prompt/btw.tsx |
| `upstream/tui/src/feature-plugins/sidebar/context.tsx` | `packages/tui/src/feature-plugins/sidebar/context.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/sidebar/context.tsx |
| `upstream/tui/src/feature-plugins/sidebar/mcp.tsx` | `packages/tui/src/feature-plugins/sidebar/mcp.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/sidebar/mcp.tsx |
| `upstream/tui/src/feature-plugins/sidebar/todo.tsx` | `packages/tui/src/feature-plugins/sidebar/todo.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/sidebar/todo.tsx |
| `upstream/tui/src/feature-plugins/system/diff-viewer-file-menu.tsx` | `packages/tui/src/feature-plugins/system/diff-viewer-file-menu.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/system/diff-viewer-file-menu.tsx |
| `upstream/tui/src/feature-plugins/system/diff-viewer-file-tree.tsx` | `packages/tui/src/feature-plugins/system/diff-viewer-file-tree.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/system/diff-viewer-file-tree.tsx |
| `upstream/tui/src/feature-plugins/system/diff-viewer-image.tsx` | `packages/tui/src/feature-plugins/system/diff-viewer-image.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/system/diff-viewer-image.tsx |
| `upstream/tui/src/feature-plugins/system/diff-viewer.tsx` | `packages/tui/src/feature-plugins/system/diff-viewer.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/system/diff-viewer.tsx |
| `upstream/tui/src/feature-plugins/system/notifications.ts` | `packages/tui/src/feature-plugins/system/notifications.ts` | Copia del código adaptado: packages/tui/src/feature-plugins/system/notifications.ts |
| `upstream/tui/src/feature-plugins/system/plugins.tsx` | `packages/tui/src/feature-plugins/system/plugins.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/system/plugins.tsx |
| `upstream/tui/src/feature-plugins/system/stats-data.ts` | `packages/tui/src/feature-plugins/system/stats-data.ts` | Copia del código adaptado: packages/tui/src/feature-plugins/system/stats-data.ts |
| `upstream/tui/src/feature-plugins/system/stats.tsx` | `packages/tui/src/feature-plugins/system/stats.tsx` | Copia del código adaptado: packages/tui/src/feature-plugins/system/stats.tsx |
| `upstream/tui/src/mini/demo.ts` | `packages/tui/src/mini/demo.ts` | Copia del código adaptado: packages/tui/src/mini/demo.ts |
| `upstream/tui/src/mini/entry.body.ts` | `packages/tui/src/mini/entry.body.ts` | Copia del código adaptado: packages/tui/src/mini/entry.body.ts |
| `upstream/tui/src/mini/footer.command.tsx` | `packages/tui/src/mini/footer.command.tsx` | Copia del código adaptado: packages/tui/src/mini/footer.command.tsx |
| `upstream/tui/src/mini/footer.form.tsx` | `packages/tui/src/mini/footer.form.tsx` | Copia del código adaptado: packages/tui/src/mini/footer.form.tsx |
| `upstream/tui/src/mini/footer.menu.tsx` | `packages/tui/src/mini/footer.menu.tsx` | Copia del código adaptado: packages/tui/src/mini/footer.menu.tsx |
| `upstream/tui/src/mini/footer.subagent.tsx` | `packages/tui/src/mini/footer.subagent.tsx` | Copia del código adaptado: packages/tui/src/mini/footer.subagent.tsx |
| `upstream/tui/src/mini/footer.ts` | `packages/tui/src/mini/footer.ts` | Copia del código adaptado: packages/tui/src/mini/footer.ts |
| `upstream/tui/src/mini/footer.view.tsx` | `packages/tui/src/mini/footer.view.tsx` | Copia del código adaptado: packages/tui/src/mini/footer.view.tsx |
| `upstream/tui/src/mini/form.shared.ts` | `packages/tui/src/mini/form.shared.ts` | Copia del código adaptado: packages/tui/src/mini/form.shared.ts |
| `upstream/tui/src/mini/runtime.ts` | `packages/tui/src/mini/runtime.ts` | Copia del código adaptado: packages/tui/src/mini/runtime.ts |
| `upstream/tui/src/mini/scrollback.writer.tsx` | `packages/tui/src/mini/scrollback.writer.tsx` | Copia del código adaptado: packages/tui/src/mini/scrollback.writer.tsx |
| `upstream/tui/src/mini/stream-v2.subagent.ts` | `packages/tui/src/mini/stream-v2.subagent.ts` | Copia del código adaptado: packages/tui/src/mini/stream-v2.subagent.ts |
| `upstream/tui/src/mini/stream-v2.transport.ts` | `packages/tui/src/mini/stream-v2.transport.ts` | Copia del código adaptado: packages/tui/src/mini/stream-v2.transport.ts |
| `upstream/tui/src/mini/tool.ts` | `packages/tui/src/mini/tool.ts` | Copia del código adaptado: packages/tui/src/mini/tool.ts |
| `upstream/tui/src/plugin/api.tsx` | `packages/tui/src/plugin/api.tsx` | Copia del código adaptado: packages/tui/src/plugin/api.tsx |
| `upstream/tui/src/plugin/context.tsx` | `packages/tui/src/plugin/context.tsx` | Copia del código adaptado: packages/tui/src/plugin/context.tsx |
| `upstream/tui/src/plugin/render.tsx` | `packages/tui/src/plugin/render.tsx` | Copia del código adaptado: packages/tui/src/plugin/render.tsx |
| `upstream/tui/src/routes/home.tsx` | `packages/tui/src/routes/home.tsx` | Copia del código adaptado: packages/tui/src/routes/home.tsx |
| `upstream/tui/src/routes/session/activity-summary.ts` | `packages/tui/src/routes/session/activity-summary.ts` | Copia del código adaptado: packages/tui/src/routes/session/activity-summary.ts |
| `upstream/tui/src/routes/session/composer/index.tsx` | `packages/tui/src/routes/session/composer/index.tsx` | Copia del código adaptado: packages/tui/src/routes/session/composer/index.tsx |
| `upstream/tui/src/routes/session/composer/shell-tab.tsx` | `packages/tui/src/routes/session/composer/shell-tab.tsx` | Copia del código adaptado: packages/tui/src/routes/session/composer/shell-tab.tsx |
| `upstream/tui/src/routes/session/composer/subagents-tab.tsx` | `packages/tui/src/routes/session/composer/subagents-tab.tsx` | Copia del código adaptado: packages/tui/src/routes/session/composer/subagents-tab.tsx |
| `upstream/tui/src/routes/session/composer/terminals-tab.tsx` | `packages/tui/src/routes/session/composer/terminals-tab.tsx` | Copia del código adaptado: packages/tui/src/routes/session/composer/terminals-tab.tsx |
| `upstream/tui/src/routes/session/dialog-execute.tsx` | `packages/tui/src/routes/session/dialog-execute.tsx` | Copia del código adaptado: packages/tui/src/routes/session/dialog-execute.tsx |
| `upstream/tui/src/routes/session/dialog-fork.tsx` | `packages/tui/src/routes/session/dialog-fork.tsx` | Copia del código adaptado: packages/tui/src/routes/session/dialog-fork.tsx |
| `upstream/tui/src/routes/session/dialog-message.tsx` | `packages/tui/src/routes/session/dialog-message.tsx` | Copia del código adaptado: packages/tui/src/routes/session/dialog-message.tsx |
| `upstream/tui/src/routes/session/dialog-timeline.tsx` | `packages/tui/src/routes/session/dialog-timeline.tsx` | Copia del código adaptado: packages/tui/src/routes/session/dialog-timeline.tsx |
| `upstream/tui/src/routes/session/form.tsx` | `packages/tui/src/routes/session/form.tsx` | Copia del código adaptado: packages/tui/src/routes/session/form.tsx |
| `upstream/tui/src/routes/session/group-view.tsx` | `packages/tui/src/routes/session/group-view.tsx` | Copia del código adaptado: packages/tui/src/routes/session/group-view.tsx |
| `upstream/tui/src/routes/session/location-missing.tsx` | `packages/tui/src/routes/session/location-missing.tsx` | Copia del código adaptado: packages/tui/src/routes/session/location-missing.tsx |
| `upstream/tui/src/ui/dialog-alert.tsx` | `packages/tui/src/ui/dialog-alert.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog-alert.tsx |
| `upstream/tui/src/ui/dialog-confirm.tsx` | `packages/tui/src/ui/dialog-confirm.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog-confirm.tsx |
| `upstream/tui/src/ui/dialog-export-options.tsx` | `packages/tui/src/ui/dialog-export-options.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog-export-options.tsx |
| `upstream/tui/src/ui/dialog-export-result.tsx` | `packages/tui/src/ui/dialog-export-result.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog-export-result.tsx |
| `upstream/tui/src/ui/dialog-help.tsx` | `packages/tui/src/ui/dialog-help.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog-help.tsx |
| `upstream/tui/src/ui/dialog-prompt.tsx` | `packages/tui/src/ui/dialog-prompt.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog-prompt.tsx |
| `upstream/tui/src/ui/dialog-select.tsx` | `packages/tui/src/ui/dialog-select.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog-select.tsx |
| `upstream/tui/src/ui/dialog.tsx` | `packages/tui/src/ui/dialog.tsx` | Copia del código adaptado: packages/tui/src/ui/dialog.tsx |
| `upstream/tui/src/ui/toast.tsx` | `packages/tui/src/ui/toast.tsx` | Copia del código adaptado: packages/tui/src/ui/toast.tsx |
| `upstream/tui/src/ui/working-directory-actions.tsx` | `packages/tui/src/ui/working-directory-actions.tsx` | Copia del código adaptado: packages/tui/src/ui/working-directory-actions.tsx |
| `upstream/tui/src/util/form.ts` | `packages/tui/src/util/form.ts` | Copia del código adaptado: packages/tui/src/util/form.ts |
| `upstream/tui/src/util/locale.ts` | `packages/tui/src/util/locale.ts` | Copia del código adaptado: packages/tui/src/util/locale.ts |
| `upstream/tui/src/util/model.ts` | `packages/tui/src/util/model.ts` | Copia del código adaptado: packages/tui/src/util/model.ts |
| `upstream/tui/src/util/permission.ts` | `packages/tui/src/util/permission.ts` | Copia del código adaptado: packages/tui/src/util/permission.ts |
| `upstream/tui/src/util/presentation.ts` | `packages/tui/src/util/presentation.ts` | Copia del código adaptado: packages/tui/src/util/presentation.ts |
| `upstream/tui/src/util/selection.ts` | `packages/tui/src/util/selection.ts` | Copia del código adaptado: packages/tui/src/util/selection.ts |
| `upstream/tui/src/util/spanish.ts` | `packages/tui/src/util/spanish.ts` | Copia del código adaptado: packages/tui/src/util/spanish.ts |
| `upstream/tui/src/util/tool-display.ts` | `packages/tui/src/util/tool-display.ts` | Copia del código adaptado: packages/tui/src/util/tool-display.ts |
| `upstream/tui/test/clear-session.test.tsx` | `packages/tui/test/clear-session.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/cmd/tui/integration-options.test.ts` | `packages/tui/test/cli/cmd/tui/integration-options.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/cmd/tui/model-options.test.ts` | `packages/tui/test/cli/cmd/tui/model-options.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/cmd/tui/notifications.test.ts` | `packages/tui/test/cli/cmd/tui/notifications.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` | `packages/tui/test/cli/tui/__snapshots__/inline-tool-wrap-snapshot.test.tsx.snap` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/anchors.test.ts` | `packages/tui/test/cli/tui/anchors.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/collapse-tool-output.test.ts` | `packages/tui/test/cli/tui/collapse-tool-output.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/command-palette.test.tsx` | `packages/tui/test/cli/tui/command-palette.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/composer-keymap.test.tsx` | `packages/tui/test/cli/tui/composer-keymap.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/data.test.tsx` | `packages/tui/test/cli/tui/data.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/dialog-integration.test.tsx` | `packages/tui/test/cli/tui/dialog-integration.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/dialog-mcp.test.tsx` | `packages/tui/test/cli/tui/dialog-mcp.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/dialog-open.test.tsx` | `packages/tui/test/cli/tui/dialog-open.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/dialog-prompt.test.tsx` | `packages/tui/test/cli/tui/dialog-prompt.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/dialog-select.test.tsx` | `packages/tui/test/cli/tui/dialog-select.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/dialog-session-list.test.tsx` | `packages/tui/test/cli/tui/dialog-session-list.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/diff-viewer-file-tree.test.tsx` | `packages/tui/test/cli/tui/diff-viewer-file-tree.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/diff-viewer-image.test.tsx` | `packages/tui/test/cli/tui/diff-viewer-image.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/diff-viewer.test.tsx` | `packages/tui/test/cli/tui/diff-viewer.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/form.test.tsx` | `packages/tui/test/cli/tui/form.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/group-boundary.test.ts` | `packages/tui/test/cli/tui/group-boundary.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/grouping-tree.test.ts` | `packages/tui/test/cli/tui/grouping-tree.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` | `packages/tui/test/cli/tui/inline-tool-wrap-snapshot.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/input-scope.test.tsx` | `packages/tui/test/cli/tui/input-scope.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/keymap-arguments.test.tsx` | `packages/tui/test/cli/tui/keymap-arguments.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/message-navigation.test.ts` | `packages/tui/test/cli/tui/message-navigation.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/mount-budget.test.ts` | `packages/tui/test/cli/tui/mount-budget.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/permission.test.ts` | `packages/tui/test/cli/tui/permission.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/plugins-dialog.test.tsx` | `packages/tui/test/cli/tui/plugins-dialog.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/prompt-interrupt-status.test.tsx` | `packages/tui/test/cli/tui/prompt-interrupt-status.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/prompt-move.test.tsx` | `packages/tui/test/cli/tui/prompt-move.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/session-grouping.test.ts` | `packages/tui/test/cli/tui/session-grouping.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/session-history.test.ts` | `packages/tui/test/cli/tui/session-history.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/session-rows.test.ts` | `packages/tui/test/cli/tui/session-rows.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/session-verbosity.test.ts` | `packages/tui/test/cli/tui/session-verbosity.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/theme-mode.test.tsx` | `packages/tui/test/cli/tui/theme-mode.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/thinking.test.ts` | `packages/tui/test/cli/tui/thinking.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/toast.test.tsx` | `packages/tui/test/cli/tui/toast.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/cli/tui/use-event.test.tsx` | `packages/tui/test/cli/tui/use-event.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/client-mcp.test.tsx` | `packages/tui/test/client-mcp.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/clipboard.test.ts` | `packages/tui/test/clipboard.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/completion-notices.test.tsx` | `packages/tui/test/completion-notices.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/dialog-error-details.test.tsx` | `packages/tui/test/component/dialog-error-details.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/dialog-export-options.test.tsx` | `packages/tui/test/component/dialog-export-options.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/dialog-highlights.test.tsx` | `packages/tui/test/component/dialog-highlights.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/dialog-shell-output.test.tsx` | `packages/tui/test/component/dialog-shell-output.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/dialog-update.test.tsx` | `packages/tui/test/component/dialog-update.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/dialog-variant.test.tsx` | `packages/tui/test/component/dialog-variant.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/go-upsell-art.test.tsx` | `packages/tui/test/component/go-upsell-art.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/retry-provider.test.tsx` | `packages/tui/test/component/retry-provider.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/session-tabs-marquee.test.ts` | `packages/tui/test/component/session-tabs-marquee.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/session-tabs-mouse.test.tsx` | `packages/tui/test/component/session-tabs-mouse.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/session-tabs-rail.test.tsx` | `packages/tui/test/component/session-tabs-rail.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/session-tabs-status.test.tsx` | `packages/tui/test/component/session-tabs-status.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/shimmer-text.test.tsx` | `packages/tui/test/component/shimmer-text.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/spinner-renderable.test.tsx` | `packages/tui/test/component/spinner-renderable.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/tab-pulse.test.tsx` | `packages/tui/test/component/tab-pulse.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/component/terminal-pane-theme.test.ts` | `packages/tui/test/component/terminal-pane-theme.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/config-v2.test.tsx` | `packages/tui/test/config-v2.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/config.test.tsx` | `packages/tui/test/config.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/local-selection.test.tsx` | `packages/tui/test/context/local-selection.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/local.test.ts` | `packages/tui/test/context/local.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/program-status.test.ts` | `packages/tui/test/context/program-status.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/session-retention.test.ts` | `packages/tui/test/context/session-retention.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/session-tabs-model.test.ts` | `packages/tui/test/context/session-tabs-model.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/session-tabs.test.tsx` | `packages/tui/test/context/session-tabs.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/storage.test.ts` | `packages/tui/test/context/storage.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/context/theme.test.tsx` | `packages/tui/test/context/theme.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/copy-session-id.test.tsx` | `packages/tui/test/copy-session-id.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/editor.test.ts` | `packages/tui/test/editor.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/feature-plugins/diff-viewer-file-tree-utils.test.ts` | `packages/tui/test/feature-plugins/diff-viewer-file-tree-utils.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/feature-plugins/home-footer.test.ts` | `packages/tui/test/feature-plugins/home-footer.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/feature-plugins/prompt-footer.test.tsx` | `packages/tui/test/feature-plugins/prompt-footer.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/feature-plugins/sidebar-context.test.tsx` | `packages/tui/test/feature-plugins/sidebar-context.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/feature-plugins/sidebar-footer.test.tsx` | `packages/tui/test/feature-plugins/sidebar-footer.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/highlights.test.ts` | `packages/tui/test/highlights.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/interactivity.test.tsx` | `packages/tui/test/interactivity.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/keybind.test.ts` | `packages/tui/test/keybind.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/keymap-scope.test.tsx` | `packages/tui/test/keymap-scope.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/keymap.test.tsx` | `packages/tui/test/keymap.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/localization.test.tsx` | `packages/tui/test/localization.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/markdown-streaming.test.tsx` | `packages/tui/test/markdown-streaming.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/blocker.responsive.test.tsx` | `packages/tui/test/mini/blocker.responsive.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/catalog.shared.test.ts` | `packages/tui/test/mini/catalog.shared.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/entry.body.test.ts` | `packages/tui/test/mini/entry.body.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/footer-keymap.test.tsx` | `packages/tui/test/mini/footer-keymap.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/footer.menu.test.ts` | `packages/tui/test/mini/footer.menu.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/footer.responsive.test.tsx` | `packages/tui/test/mini/footer.responsive.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/footer.test.ts` | `packages/tui/test/mini/footer.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/footer.view.test.tsx` | `packages/tui/test/mini/footer.view.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/footer.width.test.ts` | `packages/tui/test/mini/footer.width.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/form.shared.test.ts` | `packages/tui/test/mini/form.shared.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/permission.shared.test.ts` | `packages/tui/test/mini/permission.shared.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/prompt.editor.test.ts` | `packages/tui/test/mini/prompt.editor.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/prompt.shared.test.ts` | `packages/tui/test/mini/prompt.shared.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/runtime.boot.test.ts` | `packages/tui/test/mini/runtime.boot.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/runtime.queue.test.ts` | `packages/tui/test/mini/runtime.queue.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/runtime.test.ts` | `packages/tui/test/mini/runtime.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/scrollback.image.test.ts` | `packages/tui/test/mini/scrollback.image.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/scrollback.surface.test.ts` | `packages/tui/test/mini/scrollback.surface.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/session.shared.test.ts` | `packages/tui/test/mini/session.shared.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/splash.test.ts` | `packages/tui/test/mini/splash.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/stream-v2.transport.test.ts` | `packages/tui/test/mini/stream-v2.transport.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/stream.test.ts` | `packages/tui/test/mini/stream.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/theme.test.ts` | `packages/tui/test/mini/theme.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/tool.test.ts` | `packages/tui/test/mini/tool.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/variant.shared.test.ts` | `packages/tui/test/mini/variant.shared.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/mini/verbosity.test.ts` | `packages/tui/test/mini/verbosity.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/model-preference.test.ts` | `packages/tui/test/model-preference.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/new-session-location.test.ts` | `packages/tui/test/new-session-location.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/panel.test.ts` | `packages/tui/test/panel.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-discovery.test.ts` | `packages/tui/test/plugin-discovery.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-keymap.test.tsx` | `packages/tui/test/plugin-keymap.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-markdown.test.tsx` | `packages/tui/test/plugin-markdown.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-model.test.tsx` | `packages/tui/test/plugin-model.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-native-resources.test.tsx` | `packages/tui/test/plugin-native-resources.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-select.test.tsx` | `packages/tui/test/plugin-select.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-source.test.ts` | `packages/tui/test/plugin-source.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/plugin-toast.test.tsx` | `packages/tui/test/plugin-toast.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt-offset.test.tsx` | `packages/tui/test/prompt-offset.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt-paste.test.tsx` | `packages/tui/test/prompt-paste.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/attachment.test.ts` | `packages/tui/test/prompt/attachment.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/autocomplete.test.ts` | `packages/tui/test/prompt/autocomplete.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/codec.test.ts` | `packages/tui/test/prompt/codec.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/display.test.ts` | `packages/tui/test/prompt/display.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/draft-stash.test.ts` | `packages/tui/test/prompt/draft-stash.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/history-provider.test.tsx` | `packages/tui/test/prompt/history-provider.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/history.test.ts` | `packages/tui/test/prompt/history.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/jsonl.test.ts` | `packages/tui/test/prompt/jsonl.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/local-attachment.test.ts` | `packages/tui/test/prompt/local-attachment.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/mention.test.ts` | `packages/tui/test/prompt/mention.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/parse.test.ts` | `packages/tui/test/prompt/parse.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/part.test.ts` | `packages/tui/test/prompt/part.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/persistence.test.ts` | `packages/tui/test/prompt/persistence.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/prompt/traits.test.ts` | `packages/tui/test/prompt/traits.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/runtime.test.tsx` | `packages/tui/test/runtime.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/session-dialog-resync.test.tsx` | `packages/tui/test/session-dialog-resync.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/session-fork-pending.test.tsx` | `packages/tui/test/session-fork-pending.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/session-home.test.tsx` | `packages/tui/test/session-home.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/session-mount-budget.test.tsx` | `packages/tui/test/session-mount-budget.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/session-terminal-availability.test.tsx` | `packages/tui/test/session-terminal-availability.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/session-wheel-focus.test.tsx` | `packages/tui/test/session-wheel-focus.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/simulation/semantics.test.ts` | `packages/tui/test/simulation/semantics.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/stats.test.ts` | `packages/tui/test/stats.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/stats.view.test.tsx` | `packages/tui/test/stats.view.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/theme.test.ts` | `packages/tui/test/theme.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/theme/v2/component.test.ts` | `packages/tui/test/theme/v2/component.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/theme/v2/resolve.test.ts` | `packages/tui/test/theme/v2/resolve.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/theme/v2/select.test.ts` | `packages/tui/test/theme/v2/select.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/theme/v2/v1-migrate.test.ts` | `packages/tui/test/theme/v2/v1-migrate.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/ui/file-path.test.ts` | `packages/tui/test/ui/file-path.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/ui/layout.test.ts` | `packages/tui/test/ui/layout.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/ui/link.test.tsx` | `packages/tui/test/ui/link.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/ui/pane-resize-handle.test.tsx` | `packages/tui/test/ui/pane-resize-handle.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/ui/pane-resize.test.ts` | `packages/tui/test/ui/pane-resize.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/ui/select-controller.test.ts` | `packages/tui/test/ui/select-controller.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/added-patch.test.ts` | `packages/tui/test/util/added-patch.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/connected-provider.test.ts` | `packages/tui/test/util/connected-provider.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/delayed-presence.test.ts` | `packages/tui/test/util/delayed-presence.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/error-details.test.ts` | `packages/tui/test/util/error-details.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/error.test.ts` | `packages/tui/test/util/error.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/filetype.test.ts` | `packages/tui/test/util/filetype.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/form.test.ts` | `packages/tui/test/util/form.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/locale.test.ts` | `packages/tui/test/util/locale.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/marquee.test.ts` | `packages/tui/test/util/marquee.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/model.test.ts` | `packages/tui/test/util/model.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/path-format.test.ts` | `packages/tui/test/util/path-format.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/permission.test.ts` | `packages/tui/test/util/permission.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/presentation.test.ts` | `packages/tui/test/util/presentation.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/renderer.test.ts` | `packages/tui/test/util/renderer.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/selection-copy-on-select.test.tsx` | `packages/tui/test/util/selection-copy-on-select.test.tsx` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/selection-keys.test.ts` | `packages/tui/test/util/selection-keys.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/selection.test.ts` | `packages/tui/test/util/selection.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/session.test.ts` | `packages/tui/test/util/session.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/tui/test/util/tool-display.test.ts` | `packages/tui/test/util/tool-display.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `vendor/ui/LICENSE` | `packages/ui/LICENSE` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/package.json` | `packages/ui/package.json` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-01.aac` | `packages/ui/src/assets/audio/alert-01.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-01.mp3` | `packages/ui/src/assets/audio/alert-01.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-02.aac` | `packages/ui/src/assets/audio/alert-02.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-02.mp3` | `packages/ui/src/assets/audio/alert-02.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-03.aac` | `packages/ui/src/assets/audio/alert-03.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-03.mp3` | `packages/ui/src/assets/audio/alert-03.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-04.aac` | `packages/ui/src/assets/audio/alert-04.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-04.mp3` | `packages/ui/src/assets/audio/alert-04.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-05.aac` | `packages/ui/src/assets/audio/alert-05.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-05.mp3` | `packages/ui/src/assets/audio/alert-05.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-06.aac` | `packages/ui/src/assets/audio/alert-06.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-06.mp3` | `packages/ui/src/assets/audio/alert-06.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-07.aac` | `packages/ui/src/assets/audio/alert-07.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-07.mp3` | `packages/ui/src/assets/audio/alert-07.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-08.aac` | `packages/ui/src/assets/audio/alert-08.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-08.mp3` | `packages/ui/src/assets/audio/alert-08.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-09.aac` | `packages/ui/src/assets/audio/alert-09.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-09.mp3` | `packages/ui/src/assets/audio/alert-09.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-10.aac` | `packages/ui/src/assets/audio/alert-10.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/alert-10.mp3` | `packages/ui/src/assets/audio/alert-10.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-01.aac` | `packages/ui/src/assets/audio/bip-bop-01.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-01.mp3` | `packages/ui/src/assets/audio/bip-bop-01.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-02.aac` | `packages/ui/src/assets/audio/bip-bop-02.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-02.mp3` | `packages/ui/src/assets/audio/bip-bop-02.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-03.aac` | `packages/ui/src/assets/audio/bip-bop-03.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-03.mp3` | `packages/ui/src/assets/audio/bip-bop-03.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-04.aac` | `packages/ui/src/assets/audio/bip-bop-04.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-04.mp3` | `packages/ui/src/assets/audio/bip-bop-04.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-05.aac` | `packages/ui/src/assets/audio/bip-bop-05.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-05.mp3` | `packages/ui/src/assets/audio/bip-bop-05.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-06.aac` | `packages/ui/src/assets/audio/bip-bop-06.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-06.mp3` | `packages/ui/src/assets/audio/bip-bop-06.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-07.aac` | `packages/ui/src/assets/audio/bip-bop-07.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-07.mp3` | `packages/ui/src/assets/audio/bip-bop-07.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-08.aac` | `packages/ui/src/assets/audio/bip-bop-08.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-08.mp3` | `packages/ui/src/assets/audio/bip-bop-08.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-09.aac` | `packages/ui/src/assets/audio/bip-bop-09.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-09.mp3` | `packages/ui/src/assets/audio/bip-bop-09.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-10.aac` | `packages/ui/src/assets/audio/bip-bop-10.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/bip-bop-10.mp3` | `packages/ui/src/assets/audio/bip-bop-10.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-01.aac` | `packages/ui/src/assets/audio/nope-01.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-01.mp3` | `packages/ui/src/assets/audio/nope-01.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-02.aac` | `packages/ui/src/assets/audio/nope-02.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-02.mp3` | `packages/ui/src/assets/audio/nope-02.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-03.aac` | `packages/ui/src/assets/audio/nope-03.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-03.mp3` | `packages/ui/src/assets/audio/nope-03.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-04.aac` | `packages/ui/src/assets/audio/nope-04.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-04.mp3` | `packages/ui/src/assets/audio/nope-04.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-05.aac` | `packages/ui/src/assets/audio/nope-05.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-05.mp3` | `packages/ui/src/assets/audio/nope-05.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-06.aac` | `packages/ui/src/assets/audio/nope-06.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-06.mp3` | `packages/ui/src/assets/audio/nope-06.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-07.aac` | `packages/ui/src/assets/audio/nope-07.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-07.mp3` | `packages/ui/src/assets/audio/nope-07.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-08.aac` | `packages/ui/src/assets/audio/nope-08.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-08.mp3` | `packages/ui/src/assets/audio/nope-08.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-09.aac` | `packages/ui/src/assets/audio/nope-09.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-09.mp3` | `packages/ui/src/assets/audio/nope-09.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-10.aac` | `packages/ui/src/assets/audio/nope-10.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-10.mp3` | `packages/ui/src/assets/audio/nope-10.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-11.aac` | `packages/ui/src/assets/audio/nope-11.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-11.mp3` | `packages/ui/src/assets/audio/nope-11.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-12.aac` | `packages/ui/src/assets/audio/nope-12.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/nope-12.mp3` | `packages/ui/src/assets/audio/nope-12.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-01.aac` | `packages/ui/src/assets/audio/staplebops-01.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-01.mp3` | `packages/ui/src/assets/audio/staplebops-01.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-02.aac` | `packages/ui/src/assets/audio/staplebops-02.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-02.mp3` | `packages/ui/src/assets/audio/staplebops-02.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-03.aac` | `packages/ui/src/assets/audio/staplebops-03.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-03.mp3` | `packages/ui/src/assets/audio/staplebops-03.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-04.aac` | `packages/ui/src/assets/audio/staplebops-04.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-04.mp3` | `packages/ui/src/assets/audio/staplebops-04.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-05.aac` | `packages/ui/src/assets/audio/staplebops-05.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-05.mp3` | `packages/ui/src/assets/audio/staplebops-05.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-06.aac` | `packages/ui/src/assets/audio/staplebops-06.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-06.mp3` | `packages/ui/src/assets/audio/staplebops-06.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-07.aac` | `packages/ui/src/assets/audio/staplebops-07.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/staplebops-07.mp3` | `packages/ui/src/assets/audio/staplebops-07.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-01.aac` | `packages/ui/src/assets/audio/yup-01.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-01.mp3` | `packages/ui/src/assets/audio/yup-01.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-02.aac` | `packages/ui/src/assets/audio/yup-02.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-02.mp3` | `packages/ui/src/assets/audio/yup-02.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-03.aac` | `packages/ui/src/assets/audio/yup-03.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-03.mp3` | `packages/ui/src/assets/audio/yup-03.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-04.aac` | `packages/ui/src/assets/audio/yup-04.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-04.mp3` | `packages/ui/src/assets/audio/yup-04.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-05.aac` | `packages/ui/src/assets/audio/yup-05.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-05.mp3` | `packages/ui/src/assets/audio/yup-05.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-06.aac` | `packages/ui/src/assets/audio/yup-06.aac` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `vendor/ui/src/assets/audio/yup-06.mp3` | `packages/ui/src/assets/audio/yup-06.mp3` | Dependencia recuperada de OpenCode 2.1.4; véase vendor/ORIGEN.md |
| `friendly/config.ts` | `packages/cli/src/friendly/config.ts` | Copia del código adaptado: packages/cli/src/friendly/config.ts |
| `friendly/server.ts` | `packages/cli/src/friendly/server.ts` | Copia del código adaptado: packages/cli/src/friendly/server.ts |
| `friendly/index.html.txt` | `packages/cli/src/friendly/index.html.txt` | Copia del código adaptado: packages/cli/src/friendly/index.html.txt |
| `friendly/style.css.txt` | `packages/cli/src/friendly/style.css.txt` | Copia del código adaptado: packages/cli/src/friendly/style.css.txt |
| `friendly/app.js.txt` | `packages/cli/src/friendly/app.js.txt` | Copia del código adaptado: packages/cli/src/friendly/app.js.txt |
| `friendly/amigable.ts` | `packages/cli/src/commands/handlers/amigable.ts` | Copia del código adaptado: packages/cli/src/commands/handlers/amigable.ts |
| `friendly/friendly.test.ts` | `packages/cli/test/friendly.test.ts` | Prueba o fixture de comportamiento y textos de terminal |
| `upstream/cli-index.ts` | `packages/cli/src/index.ts` | Copia del código adaptado: packages/cli/src/index.ts |
| `install/Instalar-Capri.cmd` | `Instalar-Capri.cmd` | Instalador local de la edición española |
| `docs/NOTICE.md` | `NOTICE.md` | Copia del código adaptado: NOTICE.md |
| `automation/capri-espanol.yml` | `.github/workflows/capri-espanol.yml` | Copia del código adaptado: .github/workflows/capri-espanol.yml |
| `upstream/cli/src/services/standalone.ts` | `packages/cli/src/services/standalone.ts` | Copia del código adaptado: packages/cli/src/services/standalone.ts |
