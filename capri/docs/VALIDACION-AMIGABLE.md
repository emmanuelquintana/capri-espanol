# Validación · Edición Comunidad 0.3.0-es.2

Esta edición añade la interfaz de conversación y el instalador propio sobre la base española. El repositorio es `emmanuelquintana/capri-espanol`.

## Verificaciones

- Tipos de `core`, `tui` y `cli` comprobados con TypeScript.
- Pruebas del gateway HTTP: autenticación local, rechazo de otros orígenes, aislamiento de sesiones, persistencia de preferencias, protección de credenciales, límites de mensajes y permisos de conversación.
- Conversación completa desde Chrome: guardar una clave ficticia, cargar y elegir modelo, crear una sesión nativa de Capri, enviar un mensaje, recibir una respuesta y verla en el historial. Se utilizó un proveedor HTTP local simulado, identificado como prueba en la respuesta. No se usaron cuentas ni se hicieron cargos.
- Interfaz observada a 1440, 1280, 1024, 768, 430 y 390 píxeles. Capturas conservadas en `capri/docs/qa/amigable/`.
- Sin nuevas dependencias de frontend: HTML, CSS y JavaScript se incluyen en el ejecutable.

La configuración del agente y de cada sesión deniega las herramientas con la regla `action: "*", resource: "*", effect: "deny"`. Los mensajes de razonamiento y herramientas no se exponen en el chat. Las rutas del gateway no permiten consultar el almacén de claves ni ejecutar comandos arbitrarios.

## Límites de esta entrega

- No se ha validado una cuenta real de cada proveedor ni su facturación, disponibilidad o política de datos.
- Los usuarios necesitan un servicio de IA con acceso por API. El instalador no puede crear ni financiar esa cuenta.
- Se distribuye Windows x64. No se ha probado una matriz de versiones de Windows, Linux o macOS.
- El historial muestra las 100 charlas recientes y cada vista carga los últimos 200 mensajes. El almacenamiento nativo conserva el resto; ampliar la navegación de historiales extensos queda pendiente.
- La batería completa heredada no está resuelta: la última ejecución de la base registró 181 fallos. No se presenta esta edición como una versión estable validada de todo OpenCode.
- El instalador y el ejecutable no tienen firma comercial de código. Su comprobación SHA-256 detecta una copia diferente, pero no sustituye una firma del editor.

## Resultado de la entrega

Compilación Windows x64 correcta, versión `capri v0.3.0-es.2`. El instalador se ejecutó con Windows PowerShell 5.1 sobre una carpeta aislada, sin accesos directos ni cambios en el perfil personal. La copia instalada coincide con el SHA-256 del paquete. La ventana nativa también se construyó sin errores.

Las 10 pruebas focalizadas de CLI pasan (47 aserciones), incluidas las 7 nuevas del gateway y configuración. La comprobación de tipos de core, TUI y CLI pasa. Las pruebas focalizadas anteriores de español se conservan en `VALIDACION.md`.

En el ejecutable final también se verificaron una interrupción real con Detener, recuperación tras un proveedor no disponible, exportación de texto, preferencias persistidas y cierre de la ayuda con Escape. En los seis anchos no hubo desbordamiento horizontal y Enviar permaneció dentro de la pantalla. La consola de Chrome no registró errores ni advertencias. Las capturas incluyen la marca «Respuesta de prueba local» para distinguir el proveedor simulado.

También se intentó la prueba heredada `standalone server exits when its owner is killed`: falló porque no recibió su señal inicial dentro de los 10 segundos que espera internamente. Aumentar el tiempo global no cambia esa espera. Se registra como pendiente y no se incluye en el flujo focalizado de este fork. El arranque real y el cierre desde la interfaz se comprueban por separado.

Esta publicación se distribuye como **versión preliminar**. Se probó el descargador con una publicación real de nuestro fork y se corrigió el valor nulo que PowerShell emitía al completar la tarea asíncrona. La instalación desde el ZIP local también se verificó. El flujo propio de GitHub completó instalación de dependencias, tipos, 73 pruebas focalizadas, compilación y generación del paquete.
