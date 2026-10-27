# Funcionalidades: comparación de los tres proyectos

Revisiones fijadas en [repositorios.json](../repositorios.json). **C** significa implementación localizada en el código; **D**, descripción del README; **P**, anunciada como futura; **—**, no identificada como función del producto en las rutas revisadas. C no significa que se haya probado funcionando. No se ejecutaron estas aplicaciones.

## Resultado del análisis

La base anterior estaba orientada a conversar en una página. Estos dos proyectos de escritorio construyen otro producto: **Capri visible sobre el escritorio, animada, con presencia, reacciones y controles propios**. El original de seanyih aporta su identidad y un agente para programación; no aporta el escritorio de los otros dos.

Los dos `capri-desktop` no son dos variantes intercambiables del mismo motor. Mochiiwuff usa Electron/JavaScript y un shader WebGL; lachydotmcg usa C#/WinForms y tiras PNG en Windows, con otra implementación de Avalonia para macOS/Linux. Sus personajes pueden parecerse, pero unir sus carpetas no une sus estados, ventanas, audio ni herramientas.

## Matriz funcional

| Función | seanyih / Capri | mochiiwuff / desktop | lachydotmcg / desktop |
| --- | --- | --- | --- |
| Presencia transparente en escritorio | —; producto CLI/TUI de Linux | C: overlay Electron transparente, siempre visible y con paso del ratón | C: ventana WinForms por píxel y personaje sobre el escritorio |
| Cuerpo del personaje | Logo en terminal | C: textura de 240×420, deformada por shader | C: 13 tiras PNG, 142 celdas en total |
| Entrada escénica y presentación | — | C: manos en bordes, aparición, saludo y despliegue | C: aparición y estados de despertar; no es la misma coreografía |
| Reposo, dormir y despertar | — como mascota | C: deriva, miradas, sueño, máscara y recomposición | C: idle, blink, sleep y wake con sprites |
| Arrastrar, caer y sentarse en ventanas | — | C: física y seguimiento de ventanas en Windows | C: ventanas, iconos, bordes y posiciones de apoyo |
| Teletransporte, posesión y satélite | Glitches dentro de la TUI | C: secuencias propias, conmutador de posesión y satélite | C: glitches y reacciones; no se identificó la misma secuencia procedural |
| Expresiones | Personalidad textual | C: ocho retratos y recortes dramáticos, además del shader | C: blink, grin, glitch y boca por capas |
| Movimiento de boca | — del personaje de escritorio | C: gestos y sonidos sintéticos; no es TTS articulado | C: cinco formas de boca; sincronización con texto y amplitud de audio |
| Chat libre en personaje | Agente centrado en código | C: chat en panel, streaming, varios proveedores y español | C: Brain, modelo local o proveedor remoto, respuestas cortas |
| Voz hablada TTS | No se identificó integrada en el personaje | No se identificó TTS; `voice.js` sintetiza efectos y blips | C: ElevenLabs, selección de voz, reproducción y manejo de errores |
| Entrada de micrófono | — del personaje | No identificada | C: agente de voz ElevenLabs y ruta de dictado Windows |
| Voz sin pago al proveedor de voz | — | Blips y efectos, no conversación hablada | C: «Free voice chat» escucha y responde **por texto**; TTS gratuito sigue pendiente |
| Interrumpir voz | — | Cancelación del chat de texto | C: eventos de interrupción del agente de voz y control del micrófono; falta validar español en ejecución |
| Recuerdos personales | Sesiones/contexto del agente | C: nombre, estilo, frases y hasta 30 recuerdos pedidos explícitamente | Contexto corto en RAM; recordar a la persona aparece P en README |
| Historial persistente | C: sesiones del agente | C: `memory.json`, conserva 60 mensajes y usa 20 en el contexto | C: historial de Brain acotado a ocho mensajes; no se localizó persistencia de ese historial |
| Observar Claude Code / Codex / Antigravity | El propio agente usa herramientas; no es el observador de escritorio | C: tres adaptadores, con un asistente seleccionado a la vez y modo compañía | No se identificó un sistema equivalente de hooks |
| Avisos de trabajo, permiso, error y finalización | C: dentro de TUI | C: ticker, guía hacia ventana/ratón, celebración y respuesta del asistente | No es el flujo principal; su función es conversar y actuar |
| Informe diario de misiones | — como tarjeta de escritorio | C: acciones, archivos, tareas, resumen y copia de imagen | No identificado como equivalente |
| Abrir apps, sitios y controlar música | C: mediante herramientas generales del agente | C: acciones acotadas, con botones según origen y tipo | C: herramientas estructuradas para apps, sitios, música y ventanas |
| Ver pantalla y comentar juegos | No es el comportamiento del logo | No: observa geometría de ventanas, no su contenido | C: captura, modo Watch y modelo con capacidad visual |
| Usar ratón y teclado | No como compañera gráfica | No identificado como función general | C: `Computer.cs`, detección de objetivos, acciones y espera de aprobación |
| Leer/editar archivos propios del usuario | C: capacidad principal del agente | Solo vía proveedor Claude Code opcional, con sus modos de permisos; no es herramienta general del chat local | P en README; Hands indica que no puede tocar archivos; no atribuirle un editor de archivos implementado |
| Modelos locales | C: proveedores de OpenCode | C: Ollama; también servidores compatibles | C: Windows administra llama.cpp/modelos; la versión cross usa otra ruta local |
| Configuración para personas no técnicas | TUI y archivos de configuración | C: bienvenida, elección guiada, descarga de modelo y clave desde panel | C: Mainframe, hardware/modelo, progreso y configuración de voz |
| Español | No por defecto en el original | C: menús, frases, guía y prompt en español; requiere auditoría de cobertura | No se localizó un catálogo español; interfaz inglesa y voz de agente fijada a `en` |
| Instalador sin terminal | Original documenta instalador shell para Linux | C: configuración electron-builder/NSIS, por usuario, un clic | C: Setup gráfico, desinstalador, accesos y registro de Windows |
| Inicio con Windows y menú de bandeja | — de escritorio | C | C |
| Accesibilidad de movimiento y renderizado | Intensidad de glitch en TUI | C: movimiento reducido y selección de renderizado | C: preferencia de movimiento y controles; contrastes/lector de pantalla no auditados |

## Evidencias principales

Cada enlace apunta a la revisión descargada, no a un `main` que pueda cambiar. El árbol completo y sus hashes figuran en `archivos-completos.csv`.

### seanyih

- [README](https://github.com/seanyih/Capri/blob/7160631f275a8fae32462a511624cae20d85b05e/README.md): alcance Linux/TUI, capacidades heredadas y presentación de escritorio como trabajo futuro.
- [Personalidad](https://github.com/seanyih/Capri/blob/7160631f275a8fae32462a511624cae20d85b05e/capri/prompts/CAPRI.md), [tema](https://github.com/seanyih/Capri/blob/7160631f275a8fae32462a511624cae20d85b05e/capri/theme/capri-theme.json) y [lore](https://github.com/seanyih/Capri/tree/7160631f275a8fae32462a511624cae20d85b05e/capri/skills).
- [Herramientas](https://github.com/seanyih/Capri/blob/7160631f275a8fae32462a511624cae20d85b05e/packages/core/src/tool.ts) y [sesiones](https://github.com/seanyih/Capri/blob/7160631f275a8fae32462a511624cae20d85b05e/packages/core/src/session.ts): corresponden al motor del agente, no a una mascota de escritorio.
- [Nivel max](https://github.com/seanyih/Capri/blob/7160631f275a8fae32462a511624cae20d85b05e/capri/prompts/cyberpsycosis-max.md): incluye instrucciones de sabotaje; se conserva como evidencia original, no como una función propuesta.

### mochiiwuff

- [main.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/main/main.js#L133): overlay transparente; aislamiento del renderer desde la línea 150. Historial en líneas 51–72.
- [sprite.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/renderer/js/sprite.js): shader, regiones del cuerpo y parámetros. [acting.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/renderer/js/acting.js) y [capri.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/renderer/js/capri.js): coreografías y estados.
- [chat.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/renderer/js/chat.js): límites de historial, idioma, recuerdos y detección de peticiones. [config.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/main/config.js): preferencias persistentes.
- [lines.js, español desde L488](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/renderer/js/lines.js#L488), [labels.js, español desde L37](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/main/labels.js#L37).
- [voice.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/renderer/js/voice.js): Web Audio para efectos; el nombre del archivo no acredita síntesis de voz hablada.
- [llm.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/main/llm.js), [setup.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/main/setup.js), [assistants.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/main/assistants.js), [mission.js](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/src/renderer/js/mission.js).
- [package.json](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/package.json): versión 0.4.3, Electron y empaquetado NSIS. [Hook de Codex](https://github.com/mochiiwuff/capri-desktop/blob/f8395800976b4c787ec088d6fead140a934875fb/scripts/install-codex-hooks.js#L51) invoca `node` externo: excepción importante al objetivo de cero dependencias manuales.

### lachydotmcg

- [Capri.cs, clips desde L363](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Capri.cs#L363): trece clips y renderizado. `Hands.Look` y `Hands.Work` se conectan en L623–624.
- [Capri.cs, StartLocal y dictado](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Capri.cs#L2196): entrada de voz gratuita y respuesta de texto; [Dictation.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Dictation.cs) y [Ears.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Ears.cs) implementan captura/reconocimiento.
- [Voice.cs, Speak desde L228](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Voice.cs#L228): TTS por ElevenLabs. [Agent.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Agent.cs#L117): agente con idioma `en`; en L260 procesa interrupciones.
- [Brain.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Brain.cs): personalidad, conversación, proveedores y contexto de ocho mensajes. [Engine.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Engine.cs): descarga de motor/modelos con hashes y arranque local.
- [Hands.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Hands.cs): acciones estructuradas. [Computer.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Computer.cs): captura, objetivos, ratón/teclado y aprobaciones. La existencia de código para usar el equipo no elimina las funciones que el README aún anuncia como futuras.
- [Mainframe.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Mainframe.cs), [Setup.cs](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/app/Setup.cs#L98) y [proyecto cross](https://github.com/lachydotmcg/capri-desktop/blob/1165ff963e230d55704699894db8becd641f5e63/cross/Capri.Cross.csproj): GUI/instalación nativas y diferencias de plataforma.

## Hallazgos que condicionan la unión

1. **No necesitamos sustituir el personaje por un avatar genérico.** Hay tiras originales y un renderizador procedural pensado para su silueta y sus gestos. No se encontró un modelo VRM/Live2D en los recursos extraídos.
2. **Español ya existe en mochiiwuff.** El trabajo útil será completar cobertura, fijarlo por defecto y verificarlo en instalador, configuración, herramientas y voz; no rehacer otro chat desde cero.
3. **Los recuerdos más cercanos al objetivo están en mochiiwuff.** Son notas explícitas y un historial acotado, no memoria ilimitada. La unión debe conservar su edición y borrado.
4. **La percepción de pantalla es diferente de sentarse sobre una ventana.** Mochiiwuff usa geometría; lachydotmcg sí puede capturar contenido. Deben ser capacidades separadas y visibles.
5. **La traducción afecta a las acciones.** Los reconocedores de peticiones y las reglas de riesgo de `Computer.cs` contienen palabras inglesas; traducir solo las etiquetas dejaría incompleta la conducta en español.
6. **Los proveedores son alternativas, no funciones acumulables sin coste.** Chat, visión y conversación de voz pueden usar motores distintos, con claves y requisitos distintos. Deben describirse por ruta, no bajo un único «funciona offline».
7. **La configuración y las claves necesitan una sola autoridad.** Mochiiwuff dispone de `safeStorage`; `sealKey` cae a texto si no hay cifrado disponible. Lachydotmcg usa DPAPI en Windows. No se debe afirmar que todas las rutas están cifradas sin comprobarlas.
8. **Hooks de Codex pueden requerir reiniciarlo.** El README de mochiiwuff lo indica y su instalador escribe hooks externos. Esta dependencia no debe confundirse con abrir Capri como mascota independiente.

## Qué no se ha validado

No se han probado rendimiento, consumo, foco real, multimonitor, micrófonos, proveedores, hardware de inferencia, instaladores publicados ni detección de acciones en español. Las pruebas incluidas en los originales se inventariaron, pero no se ejecutaron. Esta fase entrega evidencias estáticas y extracción comprobada, no una certificación de funcionamiento.
