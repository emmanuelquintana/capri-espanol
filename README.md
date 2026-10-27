# Capri en español — Compañera de escritorio

Capri aparece sobre el escritorio, se mueve, se sienta en las ventanas y conversa en paneles junto al personaje. Esta edición parte de **mochiiwuff/capri-desktop**, con identidad propia y español por defecto.

**Etapa actual: fase 2, versión preliminar `0.1.0-es.1`.** El código está en `app/`. La implementación anterior del chat web permanece retirada.

## Instalar sin terminal

En la entrega local abre **`entrega-desktop/Capri-Espanol-Setup-0.1.0-es.1.exe`**. El asistente está en español: instalación para tu usuario, elección de carpeta, Instalar y Finalizar. Puedes abrir Capri desde el escritorio o el menú Inicio.

El instalador incluye el programa, Electron y sus fuentes. Para verla y usarla como mascota no necesitas cuentas, claves, Node, Bun, Git ni Python. Para conversar eliges un servicio de IA o descargas un modelo local desde sus paneles; esas opciones pueden necesitar conexión y recursos adicionales.

- Clic derecho sobre Capri: menú, tamaño, animaciones, modelo, ayuda y personalización.
- **Ctrl + Alt + P:** guardarla o traerla de vuelta.
- **Hablar conmigo:** conversación y configuración del modelo con botones.
- **Personalizarme:** nombre, estilo, frases y recuerdos explícitos.
- **Ver sus animaciones:** secuencias del personaje, sin ejecutar trabajos en tu equipo.

El sonido de efectos empieza silenciado. La posesión de ventanas está apagada. El perfil propio se guarda en `%APPDATA%\CapriEspanol`. Los mensajes y el contexto que use el chat se procesan mediante el proveedor elegido. Las claves no se incluyen en la información enviada al renderer.

El código está publicado en [nuestro repositorio](https://github.com/emmanuelquintana/capri-espanol). El instalador se conserva como entrega local y borrador de publicación; las versiones anteriores siguen retiradas.

## Qué se comprobó

- Nueve pruebas automatizadas, incluido el runtime de hooks sin Node en PATH y el movimiento sobre ventanas.
- Aplicación real y paneles a seis tamaños, de 390 a 1440 píxeles.
- Chat con proveedor HTTP local simulado, errores, nombre con tilde y recuerdos.
- Persistencia de nombre, recuerdos y conversación al reiniciar.
- Instalación y desinstalación de prueba, integridad de ejecutable y recursos.
- Detección de una ventana nativa al moverla y caída cuando su borde queda cubierto. Seguimiento de una ventana visible comprobado por separado en la lógica real del personaje.

Consulta la [validación y alcance de fase 2](analisis/FASE-2.md). La voz hablada, el micrófono y la percepción avanzada corresponden a la siguiente fase; los efectos actuales no son TTS. No se han validado proveedores reales ni todas las configuraciones de Windows.

## Procedencia

- [mochiiwuff/capri-desktop](https://github.com/mochiiwuff/capri-desktop): base MIT de escritorio, renderizador, coreografías y paneles.
- [seanyih/Capri](https://github.com/seanyih/Capri): referencia de personalidad y lore de aficionados.
- [lachydotmcg/capri-desktop](https://github.com/lachydotmcg/capri-desktop): referencia para las siguientes fases de voz y acciones. Su código PolyForm no se incorpora en esta entrega.

El arte mantiene los derechos y condiciones de sus titulares. El MIT del código base excluye su arte. Se conservan [avisos y licencias](NOTICE.md); no se atribuye el personaje a los autores del fork ni se declara afiliación oficial.

## Para contribuir

Con Node 24.19 y Windows, `herramientas/compilar-desktop.ps1` recupera los assets fijados, instala dependencias, prueba y compila. Las revisiones y hashes están en [repositorios.json](repositorios.json). Los assets se comprueban individualmente y no se versionan como arte propio.

`herramientas/qa-desktop.cjs` prueba la app real. `herramientas/probar-instalador-desktop.ps1` instala una copia aislada y la retira al terminar. No modifica hooks personales ni usa cuentas de IA.

Se conservan el [análisis de funcionalidades](analisis/FUNCIONALIDADES.md), el [inventario de assets](analisis/ASSETS.md), la [propuesta de unión](analisis/UNIFICACION.md) y el [registro del reinicio](analisis/REINICIO.md) de la fase 1.
