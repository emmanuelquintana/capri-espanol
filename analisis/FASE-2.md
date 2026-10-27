# Fase 2 — Capri de escritorio en español

Entrega local `0.1.0-es.1`, 27 de octubre de 2026. La base es `mochiiwuff/capri-desktop` en la revisión fijada durante la fase 1. El código activo vive en `app/`; los árboles de referencia siguen intactos en `fuentes/`.

## Implementado

- Aplicación Electron con personaje WebGL transparente sobre el escritorio. Se conservan su introducción, miradas, sueño, máscara, teletransporte, apoyo en ventanas, satélite y coreografías.
- Español por defecto, bienvenida de compañía y accesos directos a conversar y personalizarla. No necesita clave ni un asistente de programación para aparecer.
- Identidad propia: `capri-espanol-desktop`, `com.emmanuelquintana.capri.espanol`, ejecutable `CapriEspanol.exe` y perfil `%APPDATA%\CapriEspanol`.
- Caracterización española propia, inspirada en las interpretaciones de los repositorios. Conserva la ficción y explica con honestidad su naturaleza y capacidades.
- Chat y configuración guiada de modelos heredados, nombre, estilo, frases y recuerdos explícitos. Historial acotado persistente. Las respuestas reales dependen del modelo/proveedor que se conecte.
- Sonido de efectos inicialmente silenciado y posesión de ventanas apagada. Movimiento reducido según preferencias, foco de teclado y Escape para cerrar paneles.
- Paneles limitados al espacio visible, textos más legibles y margen del personaje corregido al reducir una ventana o cambiar su escala.
- «Ver sus animaciones» muestra sus coreografías; no representa actividad de programación ficticia como si se hubiera ejecutado.
- Claves guardadas mediante el cifrado de Electron; si no está disponible, se rechaza el guardado en lugar de caer a texto sin cifrar.
- Hooks con nombres propios, puerto separado y runtime incluido de Electron. El caso Windows con espacios en la ruta y sin Node en PATH está probado. No se instalaron hooks personales durante el trabajo.
- Instalador NSIS gráfico en español, instalación por usuario, carpeta seleccionable, accesos y desinstalador. El paquete incluye Electron y las fuentes; el recorrido básico no requiere Node, Bun, Git, Python ni comandos.

## Validación real

Nueve pruebas automatizadas pasan: identidad del prompt español, puente y eventos de los tres adaptadores, preservación de configuraciones ajenas en fixtures, ejecución de hooks con el runtime incluido sin Node externo y seguimiento de ventanas. Esta última ejecuta los métodos reales de Capri: una ventana visible la desplaza 30 píxeles horizontalmente y 40 verticalmente; otra ventana delante o el cierre de su apoyo hacen que se suelte.

La aplicación Electron se abrió y se observó. Se revisaron paneles a 1440, 1280, 1024, 768, 430 y 390 píxeles. Se comprobaron límites de pantalla del contenido interactivo, texto con tildes, formularios, envío por Enter, cierre por Escape y ausencia de errores de JavaScript en los recorridos automatizados. Se corrigió el contraste del botón principal y del estado: la medición automatizada exige al menos 4.5:1.

Se utilizó un proveedor HTTP **local simulado**, identificado en su respuesta y en las capturas. El chat envió sus instrucciones en español, recibió la respuesta en streaming y permitió continuar después de un error 503. Se guardaron el nombre «Álex» y un recuerdo ficticio; después de cerrar y volver a abrir se recuperaron ambos y el historial. No se usaron claves reales ni se hicieron cargos.

El instalador gráfico se inspeccionó con Windows Computer Use: selección por usuario y elección de carpeta en español. No se pulsó Instalar mediante ese control de UI; la instalación completa se automatizó con NSIS `/S` sobre una carpeta de prueba del proyecto. Ese modo ejecuta la instalación sin mostrar el asistente.

El ejecutable y `app.asar` instalados coinciden en SHA-256 con la distribución. Sobre esa **copia instalada** se repitieron las pruebas de apertura, seis tamaños, chat, errores, personalización y reinicio. También se creó una ventana nativa de prueba: el observador detectó su desplazamiento de 40 píxeles. En la ejecución final, Windows la mantuvo detrás de otras ventanas; Capri se bajó porque su borde estaba cubierto, como corresponde. El seguimiento sin obstrucciones queda comprobado en la prueba de lógica descrita arriba; no se presenta esa ejecución nativa como un seguimiento visible satisfactorio. Se esperó a que terminara el teletransporte antes de medir. La desinstalación automática de la copia terminó correctamente; los accesos directos preexistentes se conservan.

Los 32 archivos de `app/src/` coinciden byte a byte con el `app.asar` final. SHA-256 del instalador local: `c1596fa80297fb463cc3d067dde286be31ed9f3d297a7df9c0df608afaa309a5`.

Las capturas y registros detallados son locales, en `qa-desktop/`; los perfiles de prueba se excluyen de Git. `herramientas/qa-desktop.cjs` reproduce el recorrido y `herramientas/probar-instalador-desktop.ps1` prueba instalación y retirada de una copia aislada.

## Compilación y procedencia

`herramientas/compilar-desktop.ps1` instala las versiones fijadas por `app/package-lock.json`, prepara Electron, ejecuta las pruebas y genera el instalador. `preparar-desktop.ps1` recupera únicamente los 27 assets del producto base desde el ZIP fijado, comprobando tanto el ZIP como cada recurso. No sobrescribe nuestros fuentes con los originales.

El flujo de GitHub Windows reproduce la compilación y las pruebas. El comando pasa `--publish never` al empaquetador para desactivar su publicación implícita en CI. El código propio y derivado MIT se versiona; el arte y los binarios se entregan localmente y en un borrador de publicación, conservando los avisos originales. No se incorpora código PolyForm de lachydotmcg.

## Límites y siguiente fase

- Esta entrega cubre la base de escritorio. No contiene aún la unión de voz, percepción y herramientas avanzadas de lachydotmcg.
- Los sonidos son efectos sintetizados, no una voz hablada de Capri. Micrófono, TTS español, interrupción de audio y sincronización labial con una voz real corresponden a la siguiente fase.
- Los adaptadores se verificaron con eventos simulados. No se conectaron las cuentas reales de Codex, Claude o Antigravity ni se modificaron sus configuraciones personales. Instalar esos hooks puede requerir reiniciar el asistente correspondiente; usar la mascota por sí sola no lo requiere.
- No se ha validado cada proveedor, modelo local, versión de Windows, GPU, lector de pantalla ni configuración multimonitor. La calidad del personaje con un modelo real sigue pendiente.
- El instalador no tiene certificado de firma de código. Su SHA-256 acompaña a la entrega.
- El arte conserva las condiciones de sus titulares y no pasa a ser MIT por empaquetarlo. Las capacidades de visión o acciones adicionales deberán mantener permisos visibles y una revisión del puente/IPC antes de ampliar su alcance.
