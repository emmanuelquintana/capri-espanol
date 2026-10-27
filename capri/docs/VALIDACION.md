# Validación de Capri en español

Compilación local para Windows x64: **0.2.0-es.1**. Es una base de trabajo ejecutable; la batería global todavía no está resuelta.

| Comprobación | Resultado |
| --- | --- |
| Dependencias con Bun 1.4.4 | Instalación correcta con `bun install --ignore-scripts`; archivo de bloqueo actualizado |
| Tipos de core, TUI y CLI | `tsc -b packages/core packages/tui packages/cli --pretty false`: salida 0 |
| Traducción, permisos, formularios, paleta y fechas | 61 pruebas, 0 fallos, 541 aserciones |
| Ayuda de CLI y opciones de autenticación | 3 pruebas, 0 fallos, 18 aserciones |
| Personalidad y niveles | 2 pruebas, 0 fallos, 21 aserciones |
| Compilación Windows | Correcta con `--single --skip-install --skip-web-ui` |
| Versión y ayuda del ejecutable | `capri v0.2.0-es.1`; encabezados y descripciones en español |
| Inicio interactivo real | TUI abierta en una PTY, con logo y entrada en español; cierre con salida 0 |
| Selección de nivel | OpenTUI real a 40, 80 y 120 columnas; etiquetas, acentos y cierre con Escape verificados |
| Terminal estrecha | Pruebas de permisos, formularios e inspector desde 16 columnas |
| Instaladores | Análisis sintáctico de PowerShell y `bash -n`; sin instalación global |
| Fuentes canónicas | Copias de `capri/` comparadas byte a byte con sus destinos |
| Licencia original | `LICENSE` conservado sin cambios |

Los registros breves y las capturas de texto del renderizador están en [qa/](qa/). La prueba interactiva usó directorios XDG aislados, sin credenciales ni conversaciones personales.

## Repetir las pruebas focalizadas

Desde `packages/tui`:

```bash
bun test test/localization.test.tsx test/mini/blocker.responsive.test.tsx test/cli/tui/command-palette.test.tsx test/util/locale.test.ts test/util/form.test.ts test/util/permission.test.ts test/mini/permission.shared.test.ts --only-failures
```

Desde `packages/cli`:

```bash
bun test test/spanish.test.ts test/auth-login-choices.test.ts --only-failures
```

Desde `packages/core`:

```bash
bun test test/session-system-prompt.test.ts --only-failures
```

## Batería global pendiente

La última ejecución completa de la TUI terminó con **1330 pruebas correctas, 52 omitidas y 181 fallidas**, sobre 1563 pruebas en 185 archivos. Se ejecutó durante la adaptación; después se corrigieron valores técnicos, textos y ayudas de teclado y se repitieron las pruebas focalizadas. No se volvió a ejecutar toda la batería tras esos últimos cambios.

Los fallos incluyen expectativas todavía ligadas al inglés, pruebas de componentes y casos del ciclo de sesiones. No se han clasificado todos ni se atribuyen todos al original. El registro local completo está en `.capri-tools/tui-final.log` y no se incluye en el ZIP.

Dos fallos se reprodujeron también usando los archivos originales de la TUI con las dependencias locales: `SIGHUP clears title and disposes scoped resources once` y `session title generated while an untitled session is loading remains visible`. Esa comparación limitada no sustituye una validación completa del original en un entorno limpio.

## Límites

- No se conectó un proveedor ni se llamó a un modelo. Se comprobó el idioma del prompt; la respuesta real queda por comprobar con una cuenta.
- No se validaron Linux, macOS, la interfaz web ni aplicaciones de escritorio.
- Los mensajes de proveedores, herramientas, complementos externos y diagnósticos internos pueden conservar texto en inglés.
- Esta edición no tiene canal de actualización remoto propio. Para conservarla, usa nuevas compilaciones locales con el instalador y `-Binary`; la actualización heredada apunta al proyecto original.
- Los niveles conservan tono y efectos, pero omiten las instrucciones originales de sabotaje. La revisión automática bloqueó la traducción literal de esas instrucciones.
- No se añadieron las funciones futuras, no se publicó el repositorio y no se modificó una instalación global.

## Compilación de entrega en PowerShell

```powershell
$env:OPENCODE_VERSION = '0.2.0-es.1'
$env:OPENCODE_CHANNEL = 'es'
Set-Location packages/cli
bun run script/build.ts --single --skip-install --skip-web-ui
```

Resultado: `packages/cli/dist/cli-windows-x64/bin/opencode.exe`. El ZIP contiene ese binario como `capri-es.exe` y su SHA-256 en `BUILDINFO.json`.
