# Instalador con personalización y comprobación de IA

Versión `0.2.0-es.1`, 27 de octubre de 2026. Mantiene el mismo repositorio, identidad y perfil de la edición de escritorio; conserva los datos anteriores.

## Recorrido

El instalador NSIS conserva la copia de archivos, selección de carpeta y desinstalación probadas. Su bienvenida explica el recorrido completo. La última página ofrece **Personalizar Capri y comprobar mi IA**, marcada inicialmente: al finalizar ejecuta el programa incluido con `--configurar`, que abre el asistente gráfico antes de mostrar el personaje. No utiliza un runtime externo ni una consola. Una primera apertura sin perfil también muestra el asistente; posteriormente se puede abrir desde el menú del personaje.

La personalización incluye nombre, instrucciones de conversación, tres tamaños con vista previa, animaciones, pantalla, lugar de descanso, efectos de sonido, inicio con Windows, modo de dibujo, frases y recuerdos. El modo de dibujo se aplica al volver a abrir Capri. El inicio con Windows se modifica solo desde el perfil principal; los perfiles aislados de QA no alteran ese ajuste del sistema.

## Qué comprueba

| Opción | Comprobación y ayuda |
| --- | --- |
| Capri | Su motor y fuentes están incluidos. RAM y espacio libre de la unidad del perfil son información, no una garantía de rendimiento. |
| Ollama | Distingue instalación detectada, servicio accesible y modelos disponibles. Ofrece instalación mediante winget cuando está disponible, encendido y descarga de dos modelos del catálogo existente. Muestra progreso y permite cancelar la descarga. Si falta winget, ofrece la descarga oficial. |
| LM Studio | Busca ubicaciones habituales y comprueba su API local. Explica que hay que cargar un modelo y encender el servidor. Una instalación fuera de esas ubicaciones puede no detectarse; si la API responde, sí se reconoce como disponible. |
| API en la nube | No exige un programa local. Usa una clave guardada, una variable del proveedor o una clave introducida. Busca modelos al pulsar el botón correspondiente y prueba una respuesta solo cuando se solicita. |
| Servidor propio | Valida la dirección HTTP/HTTPS, lista sus modelos y prueba una respuesta. Rechaza credenciales dentro de la URL y el envío de claves por HTTP fuera del equipo local. |
| Configurar después | Guarda la personalización. Conserva cualquier conexión y clave que ya existieran. |

Tener una aplicación instalada no equivale a tener un modelo preparado. Para guardar una **nueva conexión** se exige una respuesta de texto no vacía del modelo elegido. La comprobación caduca a los 15 minutos y deja de servir si cambia la clave, dirección o modelo. La respuesta tiene un límite de espera de 90 segundos; un modelo local muy lento puede necesitar otro intento después de cargar.

La interfaz avisa antes de la prueba de respuesta de que un servicio remoto puede cobrarla. No promete utilizar suscripciones a chats como saldo de API. Los mensajes y recuerdos se procesan con el proveedor elegido cuando se conversa.

## Datos y límites de acceso

La configuración permanece como borrador hasta **Guardar y abrir Capri**. Una conexión fallida no reemplaza la anterior. Las claves nuevas se cifran con Electron/Windows; el renderer no recibe las claves guardadas. Los errores del servidor se traducen a mensajes de ayuda y no se muestran cuerpos que puedan contener secretos.

Los canales del asistente comprueban que los invoque su propia ventana. No tienen acceso al resto de acciones del personaje. La página impide navegación externa y conexiones directas de red; el proceso principal realiza las comprobaciones. Las descargas, instalaciones y apertura de páginas oficiales requieren sus botones. No instala hooks ni cambia configuraciones de asistentes de programación.

El guardado del perfil usa un archivo temporal y sustitución del original. Si falla, se conserva la configuración anterior y se muestra el error. Las preferencias de inicio con Windows se restauran si no se pudo guardar el perfil.

## Validación

- Doce pruebas automatizadas: incluyen HTTP real contra un servidor local ficticio, rechazo de claves, elección de modelo, invalidación de comprobaciones, preservación del perfil y fallo de escritura.
- El asistente Electron empaquetado se recorrió en 1440, 1280, 1024, 768, 430 y 390 píxeles. Se comprobó el ancho del contenido, avance visible, foco y contraste renderizado mínimo de 4.5:1 en los controles y textos medidos.
- Los estados de instalación, encendido, descarga y cancelación de Ollama se simularon en fixtures del proceso principal. **No se instaló Ollama ni se descargaron modelos reales en el equipo del usuario.**
- La búsqueda de modelos, error 401 y respuesta de prueba del servidor personalizado recorrieron IPC y el cliente HTTP reales. Se verificó que el secreto ficticio no se guardaba sin cifrar y que los campos de claves se reabrían vacíos.
- Una copia NSIS instalada dentro del proyecto se probó con el nuevo asistente y con los recorridos anteriores del personaje, chat, recuerdos y reinicio. Se compararon los hashes del ejecutable y sus recursos con la distribución y se retiró la instalación de prueba.
- El enlace NSIS al asistente se compila desde `app/build/installer.nsh`; el recorrido instalado se prueba arrancando ese mismo ejecutable con `--configurar`. No se presenta esta prueba como un clic automatizado sobre la última página nativa de NSIS.

Las capturas y perfiles de prueba son locales y quedan fuera de Git. El código de reproducción está en `herramientas/qa-instalador.cjs` y `herramientas/probar-instalador-desktop.ps1`.

Los 38 archivos de `app/src/` coinciden byte a byte con los incluidos en el paquete final. SHA-256 del instalador local: `c98c820fef46915e4f0b6933bf84b0c243719fcc840a77ab1aea218f0e04ccae`.

No se probaron cuentas o facturación reales, instalaciones reales de motores adicionales ni todas las variantes de hardware y Windows. El instalador conserva el estado de versión preliminar sin firma digital y borrador de publicación por las condiciones del arte.

## Referencias de integración

Se conservan las APIs existentes: [listado de modelos de Ollama](https://docs.ollama.com/api/tags), [descarga de modelos de Ollama](https://docs.ollama.com/api/pull) y [servidor local de LM Studio](https://lmstudio.ai/docs/developer/core/server). La personalización de NSIS usa una inclusión del instalador estándar y las plantillas de electron-builder 26.18.0 instaladas en el proyecto.
