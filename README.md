# Capri en español — Fase 1: assets y análisis

La implementación anterior del chat y su instalador quedan retirados. Esta fase parte de los **tres repositorios indicados**, conservando nuestro repositorio independiente. Su resultado es material de investigación para una única compañera de escritorio en español: todavía no es una aplicación nueva ni un instalador.

Las versiones anteriores se retiraron de las descargas públicas. Durante esta fase no hay una publicación instalable recomendada.

## Abrir los resultados

- [Análisis de funcionalidades](analisis/FUNCIONALIDADES.md): qué existe en cada proyecto, evidencias y diferencias.
- [Catálogo de assets](analisis/ASSETS.md): originales, animaciones, fotogramas, recursos procedurales y procedencia.
- [Propuesta de unión, español e instalación](analisis/UNIFICACION.md): qué tomar de cada uno, incompatibilidades y condiciones para una instalación sin terminal.
- [Lámina visual de los recursos](analisis/lamina-assets.jpg), disponible en la entrega local.
- [Revisiones exactas y SHA-256 de los originales](repositorios.json).
- [Registro del reinicio](analisis/REINICIO.md) y [verificación de la extracción](analisis/VERIFICACION.txt).

**Extracción:** 3.680 archivos fuente; 141 recursos recuperados, incluidas cuatro imágenes embebidas en código; 13 tiras de animación separadas en 142 PNG y 13 vistas animadas. Se comprobaron los hashes de los originales y se reconstruyeron las tiras desde sus fotogramas sin diferencias de píxeles.

Los 141 recursos incluyen imágenes, iconos, fuentes, temas JSON, recursos de documentación y muestras de pruebas; no son 141 dibujos del personaje. Los duplicados y las categorías están identificados.

## Fuentes de esta fase

| Proyecto | Revisión | Papel en el análisis |
| --- | --- | --- |
| [seanyih/Capri](https://github.com/seanyih/Capri) | `7160631f275a8fae32462a511624cae20d85b05e` | Personalidad, lore, tema y agente de programación original. |
| [mochiiwuff/capri-desktop](https://github.com/mochiiwuff/capri-desktop) | `f8395800976b4c787ec088d6fead140a934875fb` | Personaje procedural, escritorio, español existente, hooks y configuración guiada. |
| [lachydotmcg/capri-desktop](https://github.com/lachydotmcg/capri-desktop) | `1165ff963e230d55704699894db8becd641f5e63` | Sprites, voz, percepción, acciones y distribución nativa de Windows. |

Revisión realizada el 26 de octubre de 2026, hora de México. Las descripciones se contrastaron con el código fijado, sin ejecutar aplicaciones, instalar dependencias, conectar cuentas ni modificar los hooks personales.

## Carpetas

- `fuentes/`: copias completas de los tres árboles originales; se tratan como datos de referencia.
- `descargas/`: los tres ZIP originales, con hashes fijados.
- `assets/`: recursos separados por autor y ruta original; `embedded/` contiene imágenes decodificadas y `frames-lachy/` los fotogramas y vistas animadas.
- `licencias/`: avisos originales copiados sin modificar; el código y el arte no comparten necesariamente licencia.
- `analisis/`: informes, inventarios CSV/JSON, duplicados y lámina visual.
- `herramientas/`: scripts de extracción y comprobación para reproducir la investigación; no son el futuro instalador del producto.

En GitHub se versionan el análisis, los inventarios y las herramientas. Los árboles originales, ZIP e imágenes se mantienen **en la entrega local**, sin publicar de nuevo material artístico de terceros. Los enlaces de evidencia permiten localizar cada original en su repositorio.

La decisión propuesta es usar mochiiwuff como base de la experiencia y evaluar las capacidades de lachydotmcg antes de portarlas. No se han unido sus motores en esta fase. La licencia no comercial de lachydotmcg y los derechos separados del arte se detallan en [UNIFICACION.md](analisis/UNIFICACION.md).
