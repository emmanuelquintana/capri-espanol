# Capri en español — Windows x64

Versión local: **0.2.0-es.1**. Fuente: `seanyih/Capri`, commit `7160631f275a8fae32462a511624cae20d85b05e`.

Extrae el ZIP completo y abre PowerShell en esta carpeta:

```powershell
.\capri-es.exe
```

Para instalar con el instalador del proyecto:

```powershell
.\install.ps1 -Binary ".\capri-es.exe"
```

El instalador coloca `capri.exe` en `%USERPROFILE%\.capri\bin`, añade esa carpeta al PATH del usuario y crea la configuración inicial si no existe. También instala la habilidad de lore incluida. Abre una terminal nueva después de instalar. **No hace falta reiniciar Codex.**

Dentro de Capri, usa `/connect` para configurar un proveedor y `/models` para elegir un modelo. Necesitas tu propia cuenta; no se incluye ninguna clave.

Los menús y la personalidad están adaptados al español latinoamericano. Los comandos, claves de configuración, modelos y paquetes conservan sus identificadores. Los cuatro niveles de ciberpsicosis cambian tono y efectos sin autorizar sabotaje.

Capri puede compartir las rutas de datos y credenciales de OpenCode. Para un perfil separado, define `XDG_DATA_HOME`, `XDG_CONFIG_HOME`, `XDG_CACHE_HOME` y `XDG_STATE_HOME` antes de ejecutarlo.

Esta es una base de trabajo: compila, arranca y pasa 66 pruebas focalizadas, pero la batería global tiene fallos pendientes. Consulta `VALIDACION.md` e `INGENIERIA_INVERSA.md`. No se probaron llamadas reales a modelos ni otras plataformas.

Esta edición no tiene actualizaciones remotas propias. Usa nuevas compilaciones locales con `-Binary` para mantener el español. La actualización heredada apunta a los servicios del proyecto original.

`BUILDINFO.json` identifica la fuente y el SHA-256 del ejecutable. Se conservan las licencias y los créditos originales.
