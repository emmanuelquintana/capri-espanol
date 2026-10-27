# Assets recuperados y animaciones

Los originales permanecen intactos en `fuentes/`. Las copias extraídas se organizan por autor y ruta original en `assets/`. Cada entrada de [assets.csv](assets.csv) y [assets.json](assets.json) incluye origen, revisión, enlace, tamaño, SHA-256, tipo, dimensiones, transparencia y número de frames del contenedor cuando procede.

## Resultado comprobado

| Grupo | Recursos |
| --- | ---: |
| seanyih/Capri | 43, incluidas cuatro imágenes embebidas en código |
| mochiiwuff/capri-desktop | 39 |
| lachydotmcg/capri-desktop | 59 |
| Total de entradas | **141** |
| Contenidos únicos por SHA-256 | **137** |

Son 70 PNG, 27 WebP, tres ICO, dos archivos TTF, 35 JSON de temas/recursos, dos MP3, un M4A y un JPG. Suman 23.169.763 bytes antes de los derivados. El inventario completo del código contiene 3.680 archivos.

Los MP3 y el JPG de seanyih pertenecen a fixtures de pruebas; **no son la voz ni las expresiones de Capri**. Los TTF incluyen la misma fuente en la aplicación y el sitio. Los duplicados exactos se registran en [duplicados.json](duplicados.json), sin deduplicar silenciosamente sus ubicaciones de origen.

## seanyih: identidad, tema y recursos embebidos

El material propio de Capri está principalmente en `capri/`: personalidad, niveles, lore, tema y logo. El logo PNG se recuperó también desde sus literales base64; las entradas embebidas conservan el hash del archivo fuente y la línea de extracción. No se ejecutó JavaScript para obtenerlas.

Los temas JSON no son sprites. La CLI usa renderizadores de imagen y caracteres para terminal. Ese material ayuda a conservar identidad y vocabulario, pero no sustituye el cuerpo animado de los otros dos proyectos.

## mochiiwuff: texturas y animación procedural

Carpeta extraída: `assets/mochiiwuff--capri-desktop/assets/capri/`.

- Cuerpo y recorte original: `capri-full.png`, `capri-cutout.png`.
- Cara y retratos: `capri-face.png` y ocho `face-*.png`.
- Cinco recortes dramáticos: `cutin-eyes`, `cutin-grin`, `cutin-laugh`, `cutin-look`, `cutin-many`.
- Nueve variantes WebP de introducción: agarre, sonrisa, boca, smear y saludo.
- Iconos y doce imágenes de documentación, mantenidas como documentación y no como piezas del personaje.

El cuerpo no contiene una secuencia de todas las animaciones: `src/renderer/js/sprite.js` lo deforma mediante shader, con anclajes de cabeza, hombros, brazos, cadera y rodillas. `acting.js`, `capri.js`, `fx.js`, `chip.js`, `guide.js` y `app.js` coordinan el movimiento, la escena y los efectos. Todos se conservan en los fuentes.

**Consecuencia para la unión:** copiar `capri-full.png` no conserva su interpretación escénica. Hay que conservar o portar el renderizador, sus parámetros y las coreografías. Esta fase no ha renderizado las secuencias WebGL ni inventado fotogramas equivalentes.

`voice.js` genera 14 tipos de efectos mediante Web Audio y permite reemplazos personalizados. No existe una carpeta con esas 14 voces grabadas: son síntesis procedural. Los paquetes de fuentes Chakra Petch y JetBrains Mono se declaran como dependencias; sus archivos no forman parte del árbol descargado y no se instalaron para esta fase.

## lachydotmcg: 13 tiras, 142 frames

Tiras originales: `assets/lachydotmcg--capri-desktop/assets/sprites/`. Derivados: `assets/frames-lachy/<nombre>/000.png`, etc. Cada carpeta contiene también `preview.webp`, animada y sin pérdida. [animaciones.json](animaciones.json) conserva recuentos, velocidad, dimensiones y factor de altura del renderizador original.

| Clip | Frames | FPS | Tamaño por celda |
| --- | ---: | ---: | --- |
| idle | 16 | 8 | 240×384 |
| blink | 4 | 8 | 240×384 |
| blink_glitch | 4 | 8 | 240×384 |
| grin | 16 | 8 | 240×384 |
| glitch | 10 | 15 | 240×384 |
| dangle | 24 | 10 | 240×384 |
| sleep | 16 | 6 | 240×384 |
| wake | 13 | 15 | 240×384 |
| perch | 16 | 8 | 384×384 |
| perch_blink | 4 | 8 | 384×384 |
| perch_blink_glitch | 4 | 8 | 384×384 |
| perch_glitch | 10 | 15 | 384×384 |
| mouth | 5 | 12 | 240×384 |

La boca es una capa superpuesta al idle; no es otro cuerpo completo. Los clips de perch usan otra anchura. Aplicar un único tamaño o reproducir la boca como una pose corporal produciría errores. La semántica y la escala de cada clip están en `app/Capri.cs`.

Los 142 PNG se recortaron usando los recuentos del constructor `Clip`, no una estimación visual. Se recompuso cada tira y se compararon todos sus píxeles RGBA con el original: **sin diferencias**. Las vistas WebP se generaron a la velocidad declarada; no reproducen por sí solas toda la lógica de movimiento del programa.

Se extrajeron además el chip, iconos, imágenes del sitio y la fuente Share Tech Mono con su OFL. `site/assets/capri-voice-sample.m4a` es una muestra de audio del sitio, no un sintetizador ni una autorización de clonación.

## Lectura visual

[Abrir la lámina local](lamina-assets.jpg). Contiene 37 muestras: el primer frame de cada clip de lachydotmcg y los recursos del personaje de mochiiwuff. Sirve para reconocer el material recuperado; no es un rediseño ni una captura de la futura aplicación.

## Procedencia y límites

Los recursos visuales extraídos son imágenes 2D. No se encontró un archivo VRM, Live2D, modelo 3D ni un modelo entrenado de voz en los archivos descargados. Las animaciones procedurales, efectos y personalidades se conservan como código y texto original.

Las licencias originales están en `licencias/` y sus enlaces en [UNIFICACION.md](UNIFICACION.md). En particular, el MIT de mochiiwuff excluye su arte, y lachydotmcg usa una licencia no comercial. La extracción no convierte esos recursos en propiedad del fork. Por eso el material artístico y los árboles completos se conservan localmente, con los inventarios versionados por separado.
