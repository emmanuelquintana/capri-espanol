# Capri installer (Windows). Installs the binary as `capri`, seeds ~\.config\capri\capri.json and installs Capri's skills.
# Legacy CLI installer. For the guided interface, use Instalar-Capri.cmd from emmanuelquintana/capri-espanol.
param(
    [string]$Version = $env:VERSION,
    [string]$Binary = "",
    [switch]$NoModifyPath
)
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$App = "capri"
$Repo = "emmanuelquintana/capri-espanol"
$HomeDir = [Environment]::GetFolderPath("UserProfile")

if (-not $Binary) {
    Write-Host "Esta edición en español requiere un ejecutable local. Compila el proyecto y usa -Binary (consulta README.md)." -ForegroundColor Red
    exit 1
}

if (-not [Environment]::Is64BitOperatingSystem -or $env:PROCESSOR_ARCHITECTURE -eq "ARM64") {
    Write-Host "Este instalador requiere Windows x64. Consulta README.md para compilar en tu plataforma." -ForegroundColor Red
    exit 1
}

$InstallDir = Join-Path $HomeDir ".capri\bin"
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
$Target = Join-Path $InstallDir "$App.exe"

function Install-Binary([string]$Source) {
    # Write beside the target, then rename: a running capri.exe cannot be overwritten.
    Copy-Item -Force $Source "$Target.new"
    if (Test-Path $Target) { Move-Item -Force $Target "$Target.old" -ErrorAction SilentlyContinue }
    Move-Item -Force "$Target.new" $Target
    Remove-Item -Force "$Target.old" -ErrorAction SilentlyContinue
}

if ($Binary) {
    if (-not (Test-Path $Binary)) { Write-Host "Error: no se encontró el ejecutable en $Binary" -ForegroundColor Red; exit 1 }
    Write-Host "Instalando desde: $Binary"
    Install-Binary $Binary
} else {
    $file = "$App-windows-x64.zip"
    if ($Version) { $url = "https://github.com/$Repo/releases/download/v$($Version.TrimStart('v'))/$file" }
    else { $url = "https://github.com/$Repo/releases/latest/download/$file" }
    $tmp = Join-Path ([IO.Path]::GetTempPath()) "capri_install_$([guid]::NewGuid().ToString('N'))"
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    try {
        Write-Host "Descargando $file from github.com/$Repo"
        try { Invoke-WebRequest -Uri $url -OutFile (Join-Path $tmp $file) -UseBasicParsing }
        catch {
            Write-Host "Falló la descarga: $url" -ForegroundColor Red
            Write-Host "No release for Windows yet? Build from source (see the README) and use -Binary."
            exit 1
        }
        Expand-Archive -Force -Path (Join-Path $tmp $file) -DestinationPath $tmp
        $exe = Join-Path $tmp "$App.exe"
        if (-not (Test-Path $exe)) { Write-Host "Release archive has no '$App.exe' inside." -ForegroundColor Red; exit 1 }
        Install-Binary $exe
    } finally {
        Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
    }
}

# Default Capri settings. An existing file is the user's and is never touched.
$ConfigHome = if ($env:XDG_CONFIG_HOME) { $env:XDG_CONFIG_HOME } else { Join-Path $HomeDir ".config" }
$ConfigDir = Join-Path $ConfigHome "capri"
$ConfigFile = Join-Path $ConfigDir "capri.json"
New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null
if (Test-Path $ConfigFile) {
    Write-Host "Se conserva el archivo existente $ConfigFile"
} else {
    @'
{
  // Ajustes de Capri (jsonc). Reinicia Capri para aplicar los cambios.
  // Variables de entorno que tienen prioridad al iniciar: CAPRI_LOGO, CAPRI_CYBERPSYCOSIS.

  // none | low | medium | max. Also switchable in the TUI with /cyberpsycosis.
  "cyberpsycosis": "none",

  // Intensidad de los efectos: 1 = normal, 0 = desactivados, 2 = doble (máximo 10).
  "glitchProbability": 1,

  "logo": {
    // auto | image | quadrant | halfblock
    "style": "auto"
  },

  "hide": {
    // Representar el razonamiento del modelo como símbolos cifrados.
    "thinking": true,
    // Ocultar resultados de herramientas, diferencias y diagnósticos.
    "toolResults": true,
    // Ocultar las líneas de carga de habilidades.
    "skills": true
  },

  "footer": {
    // Nombre del agente predeterminado al pie de la respuesta.
    "name": "Capri",
    // Mostrar el modelo al pie y en la entrada de mensajes.
    "model": false,
    // Mostrar tokens por segundo (requiere session.tps en tui.json).
    "tps": false
  }
}
'@ | Set-Content -Encoding UTF8 -Path $ConfigFile
    Write-Host "Se guardó la configuración inicial en $ConfigFile"
}

# Capri skills go in the global skills dir, so they work from any project. They are Capri's own, so a rerun refreshes
# them. From a checkout they are copied from capri\skills; otherwise they are fetched from the repo (the tag when
# -Version is given, else main). A failure here never fails the install.
$SkillsRoot = if ($env:OPENCODE_CONFIG_DIR) { $env:OPENCODE_CONFIG_DIR } else { Join-Path $ConfigHome "opencode" }
$SkillsDir = Join-Path $SkillsRoot "skills"
$SkillFiles = @(
    "cyberpunk-lore/SKILL.md", "cyberpunk-lore/references/characters.md", "cyberpunk-lore/references/factions.md",
    "cyberpunk-lore/references/places.md", "cyberpunk-lore/references/tech.md", "cyberpunk-lore/references/timeline.md",
    "cyberpunk-lore/references/slang.md"
)
try {
    $src = if ($PSScriptRoot) { Join-Path $PSScriptRoot "capri\skills" } else { "" }
    $ref = if ($Version) { "v$($Version.TrimStart('v'))" } else { "main" }
    foreach ($f in $SkillFiles) {
        $dest = Join-Path $SkillsDir $f
        New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
        if ($src -and (Test-Path (Join-Path $src $f))) { Copy-Item -Force (Join-Path $src $f) $dest }
        else { Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/$Repo/$ref/capri/skills/$f" -OutFile $dest }
    }
    Write-Host "Habilidades instaladas en $SkillsDir"
} catch {
    Write-Host "Advertencia: no se pudieron instalar las habilidades de Capri. Comprueba la conexión. Capri funciona sin ellas." -ForegroundColor Magenta
}

if (-not $NoModifyPath) {
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if (($userPath -split ";") -notcontains $InstallDir) {
        [Environment]::SetEnvironmentVariable("Path", ($userPath.TrimEnd(";") + ";" + $InstallDir).TrimStart(";"), "User")
        Write-Host "Se añadió $InstallDir al PATH de tu usuario. Abre una terminal nueva para usar 'capri'."
    }
}

Write-Host ""
Write-Host "Capri instalado: $Target" -ForegroundColor Green
Write-Host "Ejecuta: capri   (se recomienda Windows Terminal)"
