# Capri en español · Edición Comunidad

Un espacio para conversar con Capri, sin comandos ni conocimientos de programación.

## Instalar y abrir

1. Descarga `Capri-amigable-windows-x64.zip` desde [nuestras publicaciones](https://github.com/emmanuelquintana/capri-espanol/releases).
2. Extrae la carpeta completa del ZIP.
3. Haz doble clic en **Instalar-Capri.cmd** y pulsa **Instalar y abrir Capri**.
4. Después, abre **Capri en español** desde el escritorio o el menú Inicio.

El paquete incluye el programa y su motor. No necesitas instalar Bun, Node ni Git para el modo de conversación. Tampoco necesitas permisos de administrador ni reiniciar Codex.

El instalador también puede descargarse por separado: obtiene la versión correspondiente desde las publicaciones de **nuestro fork**. Necesita conexión a internet para esa descarga. El ZIP completo permite instalar sin conexión; conversar requiere acceso a tu servicio de IA.

## Primera conversación

Pulsa **Vamos a conocernos**. Elige tu servicio de IA y pega su **clave de acceso**, que es distinta de tu contraseña. Los servicios habituales tienen un enlace a su página; **Ver otros servicios compatibles** abre el resto.

Después elige el modelo y pulsa **Empezar a hablar con Capri**. El modelo es el motor que genera sus respuestas. Necesitas una cuenta con acceso a API; el servicio puede tener tarifas o límites propios. El instalador no crea cuentas ni incluye saldo o claves.

Escribe un mensaje y pulsa **Enviar**, o Enter. Mayús + Enter crea otra línea. Puedes detener una respuesta con **Detener**.

## Tu espacio

- **Nueva conversación:** empieza otra charla. Las anteriores siguen en la lista.
- **Personaliza tu espacio:** elige nombre, tono, texto grande y contraste. El nombre y el tono se aplican a las charlas nuevas.
- **Guardar una copia:** descarga el texto de la charla abierta.
- **× junto a una charla:** la archiva después de confirmar; no borra su contenido.
- **Ayuda para empezar:** explica conexión, claves y privacidad sin salir de Capri.
- **Salir de Capri:** cierra la conexión local y el motor. Al cerrar solo la pestaña, el motor termina tras unos minutos sin actividad.

La interfaz se abre en el navegador de tu equipo. El programa local conserva tu historial; tus mensajes se envían al servicio de IA que elijas para generar las respuestas. Las claves no se muestran en la lista de conversaciones ni se incluyen al guardar una copia.

## Archivos y actualizaciones

Programa: `%LOCALAPPDATA%\Programs\Capri`. Perfil de conversaciones, credenciales y ajustes: `%LOCALAPPDATA%\Capri\perfil`.

Esta interfaz usa un perfil separado del modo de programación y tiene desactivadas las herramientas para modificar archivos o ejecutar comandos. Protege el acceso a tu sesión de Windows: las credenciales se guardan en el almacén local heredado de OpenCode, no se promete cifrado adicional.

Para actualizar, usa el instalador de una nueva publicación de nuestro fork. Se conservan tus conversaciones y ajustes. Si no puedes sustituir el programa, cierra Capri y repite la instalación.

## Sobre esta versión

La edición `0.3.0-es.3` corrige el error «La propiedad Value no se encuentra» al instalar. Cierra la ventana anterior y utiliza el instalador nuevo. Si Capri está abierta, ciérrala antes de actualizar; tus conversaciones y preferencias se conservan.

La personalidad del chat usa una ficha propia en español. El ZIP también incluye `capri.character.json`, una tarjeta textual en formato Character Card V2. No es un avatar ni una voz. `REFERENCIAS-COMPARADAS.md` documenta los proyectos estudiados y las siguientes funciones: personaje animado, voz y memoria; después, acciones en aplicaciones y archivos. Esas funciones aún están pendientes.

Es una primera edición gráfica para Windows x64. Se ha probado con un proveedor local simulado, sin cuentas ni cargos reales. No se ha validado cada proveedor de IA ni todas las versiones de Windows. Consulta `VALIDACION-AMIGABLE.md` para conocer las comprobaciones y límites.

Código y novedades: [emmanuelquintana/capri-espanol](https://github.com/emmanuelquintana/capri-espanol). Créditos y procedencia: `NOTICE.md` y `LICENSE`.
