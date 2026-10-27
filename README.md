# Capri en español — Compañera de escritorio

Capri aparece sobre el escritorio, se mueve, se sienta en las ventanas y conversa en paneles junto al personaje. Esta edición parte de **mochiiwuff/capri-desktop**, con identidad propia y español por defecto.

**Etapa actual: fase 2, versión preliminar `0.2.0-es.1`.** El código está en `app/`. La implementación anterior del chat web permanece retirada.

## Instalar sin terminal

En la entrega local abre **`entrega-desktop/Capri-Espanol-Setup-0.2.0-es.1.exe`**. El asistente está en español: instalación para tu usuario, elección de carpeta e Instalar. Al finalizar, deja marcada **Personalizar Capri y comprobar mi IA** para continuar con la configuración gráfica. También puedes abrir Capri desde el escritorio o el menú Inicio.

El nuevo asistente tiene tres pasos:

1. **Tu Capri:** nombre, tono de conversación, tamaño con vista previa, animaciones, pantalla, descanso, sonido, inicio con Windows, frases y recuerdos.
2. **Tu inteligencia artificial:** detecta Ollama y LM Studio, muestra si el servicio responde y si hay modelos. Con Ollama puedes instalar, encender y descargar un modelo con botones. Para una API o servidor propio, introduces su clave o dirección y eliges un modelo.
3. **Comprobar y abrir:** prueba una respuesta real del modelo elegido antes de guardar la conexión. Si cambias la clave, dirección o modelo, exige repetir la prueba. Puedes elegir **Lo configuraré después** para usar el personaje sin preparar una nueva conexión.

La prueba de respuesta se inicia solo con su botón y un proveedor remoto puede cobrarla. Las claves nuevas se guardan cifradas al finalizar, después de una prueba correcta. Los demás ajustes del perfil se conservan. Puedes repetir el asistente desde **Configurar Capri y mi IA…** en el menú del personaje.

El instalador incluye el programa, Electron y sus fuentes. Para verla y usarla como mascota no necesitas cuentas, claves, Node, Bun, Git ni Python. Para conversar eliges un servicio de IA o descargas un modelo local desde sus paneles; esas opciones pueden necesitar conexión y recursos adicionales.

- Clic derecho sobre Capri: menú, tamaño, animaciones, modelo, ayuda y personalización.
- **Ctrl + Alt + P:** guardarla o traerla de vuelta.
- **Hablar conmigo:** conversación y configuración del modelo con botones.
- **Personalizarme:** nombre, estilo, frases y recuerdos explícitos.
- **Ver sus animaciones:** secuencias del personaje, sin ejecutar trabajos en tu equipo.

El sonido de efectos empieza silenciado. La posesión de ventanas está apagada. El perfil propio se guarda en `%APPDATA%\CapriEspanol`. Los mensajes y el contexto que use el chat se procesan mediante el proveedor elegido. Las claves no se incluyen en la información enviada al renderer.

El código está publicado en [nuestro repositorio](https://github.com/emmanuelquintana/capri-espanol). El instalador se conserva como entrega local y borrador de publicación; las versiones anteriores siguen retiradas.

## Qué se comprobó

- Doce pruebas automatizadas, incluido el runtime de hooks sin Node en PATH, el movimiento sobre ventanas, conexión de IA y guardado seguro del perfil.
- Aplicación real y paneles a seis tamaños, de 390 a 1440 píxeles.
- Chat con proveedor HTTP local simulado, errores, nombre con tilde y recuerdos.
- Persistencia de nombre, recuerdos y conversación al reiniciar.
- Instalación y desinstalación de prueba, integridad de ejecutable y recursos.
- Asistente nuevo en seis tamaños, contraste mínimo 4.5:1, foco de teclado y avance siempre visible.
- Estados de Ollama y cancelación con fixtures; conexión y respuesta mediante HTTP local simulado; claves cifradas con Windows.
- Detección de una ventana nativa y seguimiento al desplazarla 40 píxeles.

Consulta el [nuevo instalador y sus comprobaciones](analisis/INSTALADOR-0.2.md) y la [base de fase 2](analisis/FASE-2.md). La voz hablada, el micrófono y la percepción avanzada corresponden a la siguiente fase; los efectos actuales no son TTS. No se han validado cuentas reales ni todas las configuraciones de Windows.

## Procedencia

- [mochiiwuff/capri-desktop](https://github.com/mochiiwuff/capri-desktop): base MIT de escritorio, renderizador, coreografías y paneles.
- [seanyih/Capri](https://github.com/seanyih/Capri): referencia de personalidad y lore de aficionados.
- [lachydotmcg/capri-desktop](https://github.com/lachydotmcg/capri-desktop): referencia para las siguientes fases de voz y acciones. Su código PolyForm no se incorpora en esta entrega.

El arte mantiene los derechos y condiciones de sus titulares. El MIT del código base excluye su arte. Se conservan [avisos y licencias](NOTICE.md); no se atribuye el personaje a los autores del fork ni se declara afiliación oficial.

## Para contribuir

Con Node 24.19 y Windows, `herramientas/compilar-desktop.ps1` recupera los assets fijados, instala dependencias, prueba y compila. Las revisiones y hashes están en [repositorios.json](repositorios.json). Los assets se comprueban individualmente y no se versionan como arte propio.

`herramientas/qa-instalador.cjs` prueba la configuración gráfica y `herramientas/qa-desktop.cjs` prueba el personaje. `herramientas/probar-instalador-desktop.ps1` instala una copia aislada, ejecuta ambos recorridos y la retira al terminar. No modifica hooks personales ni usa cuentas de IA.

Se conservan el [análisis de funcionalidades](analisis/FUNCIONALIDADES.md), el [inventario de assets](analisis/ASSETS.md), la [propuesta de unión](analisis/UNIFICACION.md) y el [registro del reinicio](analisis/REINICIO.md) de la fase 1.
