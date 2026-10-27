import { Argument, Flag, GlobalFlag } from "effect/cli"
import { Schema } from "effect"
import { Spec } from "../framework/spec"
import { Updater } from "../services/updater"

export const PrintLogs = GlobalFlag.Setting("print-logs")({
  flag: Flag.Boolean("print-logs").pipe(
    Flag.withDescription("Mostrar registros en stderr (los del servidor requieren --standalone)"),
    Flag.withDefault(false),
  ),
})

export const Standalone = GlobalFlag.Setting("standalone")({
  flag: Flag.Boolean("standalone").pipe(
    Flag.withDescription("Ejecutar con un servidor privado en lugar del servicio en segundo plano"),
    Flag.withDefault(false),
  ),
})

export const Server = GlobalFlag.Setting("server")({
  flag: Flag.String("server").pipe(
    Flag.withDescription("Conectar a una URL de servidor en lugar del servicio en segundo plano"),
    Flag.optional,
  ),
})

const ServerFlags = [Standalone, Server] as const

declare const OPENCODE_CLI_NAME: string | undefined

const ServerParams = {
  standalone: Standalone.flag,
  server: Server.flag,
}

const PermissionParams = {
  auto: Flag.Boolean("auto").pipe(
    Flag.withDescription("Aprobar automáticamente los permisos no rechazados explícitamente"),
    Flag.withDefault(false),
  ),
  yolo: Flag.Boolean("yolo").pipe(Flag.withDefault(false), Flag.withHidden),
  dangerouslySkipPermissions: Flag.Boolean("dangerously-skip-permissions").pipe(
    Flag.withDefault(false),
    Flag.withHidden,
  ),
}

const Root = Spec.make(typeof OPENCODE_CLI_NAME === "string" ? OPENCODE_CLI_NAME : "capri", {
  description: "Interfaz de línea de comandos de Capri",
  params: {
    ...ServerParams,
    ...PermissionParams,
    directory: Argument.String("directory").pipe(
      Argument.withDescription("Directorio donde iniciar Capri"),
      Argument.optional,
    ),
    continue: Flag.Boolean("continue").pipe(
      Flag.withAlias("c"),
      Flag.withDescription("Continuar la última sesión"),
      Flag.withDefault(false),
    ),
    session: Flag.String("session").pipe(
      Flag.withAlias("s"),
      Flag.withDescription("ID de la sesión que se retomará o creará si no existe"),
      Flag.optional,
    ),
    prompt: Flag.String("prompt").pipe(Flag.withDescription("Mensaje inicial"), Flag.optional),
  },
  commands: [
    Spec.make("amigable", {
      description: "Abrir el chat gráfico de Capri en español, con bienvenida y conexión guiadas",
      params: {
        noOpen: Flag.Boolean("no-open").pipe(Flag.withDefault(false), Flag.withDescription("Mostrar la dirección sin abrir el navegador")),
        port: Flag.Int("port").pipe(Flag.optional),
      },
    }),
    Spec.make("upgrade", {
      description: "Actualizar OpenCode a la última versión o a una versión específica",
      aliases: ["update"],
      params: {
        target: Argument.String("target").pipe(
          Argument.withDescription("Versión de destino (con o sin v inicial)"),
          Argument.optional,
        ),
        method: Flag.Literals("method", Updater.methods).pipe(
          Flag.withAlias("m"),
          Flag.withDescription("Método de instalación"),
          Flag.optional,
        ),
      },
    }),
    Spec.make("uninstall", {
      description: "Desinstalar Capri conservando sesiones, configuración y estado",
      params: {
        dryRun: Flag.Boolean("dry-run").pipe(
          Flag.withDescription("Mostrar lo que se eliminaría sin borrarlo"),
          Flag.withDefault(false),
        ),
        force: Flag.Boolean("force").pipe(
          Flag.withAlias("f"),
          Flag.withDescription("Omitir confirmaciones"),
          Flag.withDefault(false),
        ),
      },
    }),
    Spec.make("acp", {
      description: "Iniciar un servidor Agent Client Protocol",
      params: {
        login: Flag.Boolean("login").pipe(
          Flag.withDescription("Ejecutar auth login en lugar de iniciar el servidor"),
          Flag.withDefault(false),
        ),
      },
    }),
    Spec.make("api", {
      description: "Enviar una solicitud al servidor en ejecución",
      globalFlags: ServerFlags,
      params: {
        request: Argument.String("operation | method path").pipe(
          Argument.withDescription("ID de operación OpenAPI o método HTTP seguido de una ruta"),
          Argument.variadic({ min: 1, max: 2 }),
        ),
        data: Flag.String("data").pipe(Flag.withAlias("d"), Flag.withDescription("Cuerpo de la solicitud"), Flag.optional),
        header: Flag.String("header").pipe(
          Flag.withAlias("H"),
          Flag.withDescription("Cabecera en formato nombre:valor"),
          Flag.atMost(100),
        ),
        param: Flag.KeyValuePair("param").pipe(Flag.withDescription("Parámetro de ruta o consulta OpenAPI"), Flag.optional),
      },
    }),
    Spec.make("debug", {
      description: "Herramientas de depuración y diagnóstico",
      commands: [
        Spec.make("agents", { description: "Listar todos los agentes", globalFlags: ServerFlags }),
        Spec.make("config", { description: "Listar fuentes de configuración", globalFlags: ServerFlags }),
        Spec.make("heap-dump", {
          description: "Guardar una captura de memoria del servidor y mostrar su ruta",
          globalFlags: [Server],
          params: {
            directory: Flag.String("directory").pipe(
              Flag.withDescription("Directorio de destino de la captura en lugar del directorio de registros"),
              Flag.optional,
            ),
          },
        }),
        Spec.make("paths", {
          description: "Mostrar rutas globales (datos, configuración, caché y estado)",
          params: {
            name: Argument.Literals("name", [
              "db",
              "home",
              "data",
              "config",
              "cache",
              "state",
              "tmp",
              "bin",
              "log",
              "repos",
            ]).pipe(
              Argument.withDescription(
                "Mostrar una sola ruta: db, home, data, config, cache, state, tmp, bin, log, repos",
              ),
              Argument.optional,
            ),
          },
        }),
      ],
    }),
    Spec.make("auth", {
      description: "administrar integraciones y credenciales",
      globalFlags: ServerFlags,
      commands: [
        Spec.make("list", {
          description: "listar integraciones y credenciales",
          params: {
            format: Flag.Literals("format", ["default", "json"]).pipe(
              Flag.withDescription("Formato de salida"),
              Flag.withDefault("default"),
            ),
          },
        }),
        Spec.make("login", {
          description: "conectar una integración",
          params: {
            target: Argument.String("target").pipe(
              Argument.withDescription("ID o nombre de integración, o URL de un proveedor conocido"),
              Argument.optional,
            ),
            method: Flag.String("method").pipe(Flag.withDescription("ID del método de autenticación"), Flag.optional),
            answer: Flag.String("answer").pipe(
              Flag.withDescription("Respuesta del formulario del proveedor (clave=valor; repetir para varios campos)"),
              Flag.atMost(100),
            ),
          },
        }),
        Spec.make("logout", {
          description: "cerrar sesión de una cuenta guardada",
          params: {
            target: Argument.String("target").pipe(
              Argument.withDescription("ID o nombre de integración"),
              Argument.optional,
            ),
            credential: Argument.String("credential").pipe(
              Argument.withDescription("ID o etiqueta de credencial (al omitirlo se abre un selector de cuentas)"),
              Argument.optional,
            ),
          },
        }),
        Spec.make("export", {
          description: "mostrar credenciales guardadas, incluidos secretos, en JSON",
          params: {
            target: Argument.String("target").pipe(
              Argument.withDescription("ID o nombre de integración (al omitirlo se exportan todas)"),
              Argument.optional,
            ),
          },
        }),
        Spec.make("import", {
          description: "importar credenciales exportadas con auth export",
          params: {
            file: Argument.String("file").pipe(
              Argument.withDescription("Archivo JSON que se importará (al omitirlo se lee stdin)"),
              Argument.optional,
            ),
          },
        }),
        Spec.make("switch", {
          description: "cambiar la cuenta activa de una integración",
          params: {
            target: Argument.String("target").pipe(
              Argument.withDescription("ID o nombre de integración"),
              Argument.optional,
            ),
            credential: Argument.String("credential").pipe(
              Argument.withDescription("ID o etiqueta de credencial (al omitirlo se abre un selector de cuentas)"),
              Argument.optional,
            ),
          },
        }),
      ],
    }),
    Spec.make("mcp", {
      description: "Administrar servidores MCP (Model Context Protocol)",
      commands: [
        Spec.make("list", {
          description: "Listar servidores MCP configurados y su estado",
          globalFlags: ServerFlags,
        }),
        Spec.make("add", {
          description: "Añadir un servidor MCP a la configuración",
          params: {
            name: Argument.String("name").pipe(Argument.withDescription("Nombre del servidor MCP")),
            command: Argument.String("command").pipe(
              Argument.withDescription("Comando y argumentos del servidor local, después de --"),
              Argument.variadic({ min: 0 }),
            ),
            url: Flag.String("url").pipe(Flag.withDescription("URL de un servidor MCP remoto"), Flag.optional),
            header: Flag.KeyValuePair("header").pipe(
              Flag.withDescription("Cabecera HTTP del servidor remoto, como nombre=valor"),
              Flag.optional,
            ),
            env: Flag.KeyValuePair("env").pipe(
              Flag.withDescription("Variable de entorno del servidor local, como nombre=valor"),
              Flag.optional,
            ),
            global: Flag.Boolean("global").pipe(
              Flag.withDescription("Guardar en la configuración global en lugar de la del proyecto"),
              Flag.withDefault(false),
            ),
          },
        }),
        Spec.make("auth", {
          description: "Autenticarse en un servidor MCP remoto compatible con OAuth",
          globalFlags: ServerFlags,
          params: {
            name: Argument.String("name").pipe(Argument.withDescription("Nombre del servidor MCP"), Argument.optional),
          },
        }),
        Spec.make("logout", {
          description: "Eliminar credenciales OAuth guardadas de un servidor MCP",
          globalFlags: ServerFlags,
          params: { name: Argument.String("name").pipe(Argument.withDescription("Nombre del servidor MCP")) },
        }),
      ],
    }),
    Spec.make("plugin", {
      description: "Administrar complementos",
      commands: [
        Spec.make("list", {
          description: "Listar complementos",
          globalFlags: ServerFlags,
          params: {
            builtin: Flag.Boolean("builtin").pipe(
              Flag.withDescription("Incluir complementos integrados del servidor"),
              Flag.withDefault(false),
            ),
          },
        }),
        Spec.make("add", {
          description: "Instalar un complemento y añadirlo a la configuración global",
          params: {
            package: Argument.String("package").pipe(Argument.withDescription("Paquete del registro npm o de Git")),
          },
        }),
        Spec.make("check", {
          description: "Buscar actualizaciones de complementos",
          globalFlags: ServerFlags,
          params: {
            target: Argument.String("target").pipe(
              Argument.withDescription("Paquete configurado"),
              Argument.optional,
            ),
          },
        }),
        Spec.make("update", {
          description: "Actualizar complementos",
          globalFlags: ServerFlags,
          params: {
            target: Argument.String("target").pipe(
              Argument.withDescription("Paquete configurado; omitir para actualizar todos los complementos pendientes"),
              Argument.optional,
            ),
          },
        }),
        Spec.make("remove", {
          description: "Eliminar un complemento de la configuración global",
          params: {
            package: Argument.String("package").pipe(Argument.withDescription("Identificador del paquete configurado")),
          },
        }),
      ],
    }),
    Spec.make("models", {
      description: "Listar todos los modelos disponibles",
      globalFlags: ServerFlags,
    }),
    Spec.make("stats", {
      description: "Mostrar estadísticas de uso para compartir",
      globalFlags: ServerFlags,
      params: {
        days: Flag.Int("days").pipe(
          Flag.withSchema(Schema.Int.check(Schema.isGreaterThanOrEqualTo(0))),
          Flag.withDescription("Mostrar los últimos N días; 0 indica hoy"),
          Flag.optional,
        ),
        year: Flag.Int("year").pipe(
          Flag.withSchema(Schema.Int.check(Schema.isBetween({ minimum: 1970, maximum: 9_999 }))),
          Flag.withDescription("Mostrar un año calendario"),
          Flag.optional,
        ),
        all: Flag.Boolean("all").pipe(Flag.withDescription("Mostrar estadísticas de todo el historial"), Flag.withDefault(false)),
        project: Flag.String("project").pipe(
          Flag.withDescription("Filtrar por ID de proyecto o usar \".\" para el proyecto actual"),
          Flag.optional,
        ),
        models: Flag.Boolean("models").pipe(Flag.withDescription("Mostrar uso de modelos"), Flag.withDefault(false)),
        tools: Flag.Boolean("tools").pipe(Flag.withDescription("Mostrar fiabilidad de herramientas"), Flag.withDefault(false)),
        cost: Flag.Boolean("cost").pipe(Flag.withDescription("Mostrar detalles de costos y tokens"), Flag.withDefault(false)),
        full: Flag.Boolean("full").pipe(Flag.withDescription("Mostrar todas las secciones detalladas"), Flag.withDefault(false)),
        limit: Flag.Int("limit").pipe(
          Flag.withSchema(Schema.Int.check(Schema.isGreaterThanOrEqualTo(1))),
          Flag.withDescription("Número de filas en las secciones detalladas"),
          Flag.withDefault(5),
        ),
        json: Flag.Boolean("json").pipe(Flag.withDescription("Mostrar estadísticas en JSON"), Flag.withDefault(false)),
      },
    }),
    Spec.make("mini", {
      description: "Iniciar la interfaz interactiva mínima",
      globalFlags: ServerFlags,
      params: {
        continue: Flag.Boolean("continue").pipe(
          Flag.withAlias("c"),
          Flag.withDescription("Continuar la última sesión"),
          Flag.withDefault(false),
        ),
        session: Flag.String("session").pipe(
          Flag.withAlias("s"),
          Flag.withDescription("ID de la sesión que se retomará o creará si no existe"),
          Flag.optional,
        ),
        fork: Flag.Boolean("fork").pipe(
          Flag.withDescription("Bifurcar la sesión al continuar"),
          Flag.withDefault(false),
        ),
        replay: Flag.Boolean("replay").pipe(
          Flag.withDescription("Restaurar historial al reanudar y redimensionar (desactivar con --no-replay)"),
          Flag.optional,
        ),
        replayLimit: Flag.Int("replay-limit").pipe(
          Flag.withDescription("Limitar el historial a los N mensajes más recientes (predeterminado: 200)"),
          Flag.optional,
        ),
        model: Flag.String("model").pipe(
          Flag.withAlias("m"),
          Flag.withDescription("Modelo en formato proveedor/modelo"),
          Flag.optional,
        ),
        agent: Flag.String("agent").pipe(Flag.withDescription("Agente que se usará"), Flag.optional),
        prompt: Flag.String("prompt").pipe(Flag.withDescription("Mensaje inicial"), Flag.optional),
        demo: Flag.Boolean("demo").pipe(Flag.withDefault(false), Flag.withHidden),
      },
    }),
    Spec.make("run", {
      description: "Ejecutar Capri con un mensaje",
      globalFlags: ServerFlags,
      params: {
        message: Argument.String("message").pipe(
          Argument.withDescription("Mensaje que se enviará"),
          Argument.variadic({ min: 0 }),
        ),
        continue: Flag.Boolean("continue").pipe(
          Flag.withAlias("c"),
          Flag.withDescription("Continuar la última sesión"),
          Flag.withDefault(false),
        ),
        session: Flag.String("session").pipe(
          Flag.withAlias("s"),
          Flag.withDescription("ID de la sesión que se retomará o creará si no existe"),
          Flag.optional,
        ),
        fork: Flag.Boolean("fork").pipe(
          Flag.withDescription("Bifurcar la sesión antes de continuar"),
          Flag.withDefault(false),
        ),
        model: Flag.String("model").pipe(
          Flag.withAlias("m"),
          Flag.withDescription("Modelo en formato proveedor/modelo#variante"),
          Flag.optional,
        ),
        agent: Flag.String("agent").pipe(Flag.withDescription("Agente que se usará"), Flag.optional),
        format: Flag.Literals("format", ["default", "json"]).pipe(
          Flag.withDescription("Formato de salida"),
          Flag.withDefault("default"),
        ),
        file: Flag.String("file").pipe(
          Flag.withAlias("f"),
          Flag.withDescription("Archivo adjunto al mensaje"),
          Flag.atMost(100),
        ),
        title: Flag.String("title").pipe(Flag.withDescription("Título de la sesión"), Flag.optional),
        thinking: Flag.Boolean("thinking").pipe(Flag.withDescription("Mostrar bloques de razonamiento"), Flag.withDefault(false)),
        ...PermissionParams,
      },
    }),
    Spec.make("session", {
      description: "Administrar sesiones",
      globalFlags: ServerFlags,
      commands: [
        Spec.make("list", {
          description: "Listar sesiones principales del proyecto, de más reciente a más antigua",
          params: {
            maxCount: Flag.Int("max-count").pipe(
              Flag.withAlias("n"),
              Flag.withSchema(Schema.Int.check(Schema.isGreaterThanOrEqualTo(1))),
              Flag.withDescription("Limitar a las N sesiones más recientes (predeterminado: 100)"),
              Flag.optional,
            ),
            format: Flag.Literals("format", ["table", "json"]).pipe(
              Flag.withDescription("Formato de salida"),
              Flag.withDefault("table"),
            ),
          },
        }),
        Spec.make("delete", {
          description: "Eliminar una sesión y sus sesiones hijas",
          params: {
            sessionID: Argument.String("sessionID").pipe(Argument.withDescription("ID de la sesión que se eliminará")),
          },
        }),
        Spec.make("export", {
          description: "Exportar datos de sesión como JSON",
          params: {
            session: Argument.String("session").pipe(
              Argument.withDescription("ID de la sesión que se exportará"),
              Argument.optional,
            ),
            sanitize: Flag.Boolean("sanitize").pipe(
              Flag.withDescription("Ocultar datos sensibles de la conversación y los archivos"),
              Flag.withDefault(false),
            ),
          },
        }),
        Spec.make("import", {
          description: "Importar una sesión desde un archivo JSON o una URL",
          params: {
            file: Argument.String("file").pipe(Argument.withDescription("Archivo JSON o URL que se importará")),
            directory: Flag.String("directory").pipe(
              Flag.withDescription("Directorio donde importar la sesión"),
              Flag.optional,
            ),
          },
        }),
      ],
    }),
    Spec.make("service", {
      description: "Administrar el servidor en segundo plano",
      commands: [
        Spec.make("start", { description: "Iniciar el servidor en segundo plano" }),
        Spec.make("restart", { description: "Reiniciar el servidor en segundo plano" }),
        Spec.make("status", { description: "Mostrar estado del servidor en segundo plano" }),
        Spec.make("stop", { description: "Detener el servidor en segundo plano" }),
        Spec.make("get", {
          description: "Consultar configuración del servicio",
          params: {
            key: Argument.String("key").pipe(Argument.withDescription("Ajuste del servicio o env"), Argument.optional),
            name: Argument.String("name").pipe(
              Argument.withDescription("Nombre de la variable de entorno"),
              Argument.optional,
            ),
          },
        }),
        Spec.make("set", {
          description: "Cambiar configuración del servicio",
          params: {
            key: Argument.String("key").pipe(Argument.withDescription("Ajuste del servicio o env")),
            value: Argument.String("value").pipe(
              Argument.withDescription("Valor del ajuste o nombre de variable de entorno"),
            ),
            nestedValue: Argument.String("env-value").pipe(
              Argument.withDescription("Valor de la variable de entorno"),
              Argument.optional,
            ),
          },
        }),
        Spec.make("unset", {
          description: "Eliminar un ajuste del servicio",
          params: {
            key: Argument.String("key").pipe(Argument.withDescription("Ajuste del servicio o env")),
            name: Argument.String("name").pipe(
              Argument.withDescription("Nombre de la variable de entorno"),
              Argument.optional,
            ),
          },
        }),
      ],
    }),
    Spec.make("reload", {
      description: "Recargar configuración",
      globalFlags: ServerFlags,
    }),
    Spec.make("pair", {
      description: "Mostrar enlaces de un solo uso para vincular un navegador o aplicación",
      params: {
        url: Flag.String("url").pipe(
          Flag.withDescription("Usar una URL HTTP(S) externa en los enlaces de vinculación"),
          Flag.mapTryCatch(
            (value) => {
              const url = new URL(value)
              if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash)
                throw new Error("URL de vinculación no válida")
              return url.href.replace(/\/+$/, "")
            },
            () => "Se esperaba una URL HTTP(S) sin credenciales, parámetros ni fragmento",
          ),
          Flag.optional,
        ),
        remote: Flag.Boolean("remote").pipe(
          Flag.withDescription(
            "Vincular mediante OpenTunnel, activando el acceso remoto si hace falta (expone el servidor a internet)",
          ),
          Flag.withDefault(false),
        ),
        yes: Flag.Boolean("yes").pipe(
          Flag.withAlias("y"),
          Flag.withDescription(
            "Aceptar exponer el servidor a internet al activar --remote por primera vez (obligatorio sin terminal interactiva)",
          ),
          Flag.withDefault(false),
        ),
      },
    }),
    Spec.make("serve", {
      description: "Iniciar la API v2 y el servidor web",
      params: {
        hostname: Flag.String("hostname").pipe(Flag.optional),
        port: Flag.Int("port").pipe(Flag.optional),
        cors: Flag.String("cors").pipe(
          Flag.withSchema(Schema.NonEmptyString),
          Flag.withDescription("Origen CORS adicional permitido (repetir para varios orígenes)"),
          Flag.atLeast(0),
        ),
        service: Flag.Boolean("service").pipe(Flag.withDefault(false)),
        stdio: Flag.Boolean("stdio").pipe(Flag.withDefault(false)),
      },
    }),
  ],
})

export const Commands = Root
