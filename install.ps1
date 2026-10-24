# Capri installer (Windows). Installs the binary as `capri`, seeds ~\.config\capri\capri.json and installs Capri's skills.
#   irm https://raw.githubusercontent.com/seanyih/Capri/main/install.ps1 | iex
#   & ([scriptblock]::Create((irm https://raw.githubusercontent.com/seanyih/Capri/main/install.ps1))) -Version v0.2.0
param(
    [string]$Version = $env:VERSION,
    [string]$Binary = "",
    [switch]$NoModifyPath
)
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$App = "capri"
$Repo = "seanyih/Capri"
$HomeDir = [Environment]::GetFolderPath("UserProfile")

if (-not [Environment]::Is64BitOperatingSystem -or $env:PROCESSOR_ARCHITECTURE -eq "ARM64") {
    Write-Host "Capri only ships for Windows x64 right now. Build from source instead (see the README)." -ForegroundColor Red
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
    if (-not (Test-Path $Binary)) { Write-Host "Error: Binary not found at $Binary" -ForegroundColor Red; exit 1 }
    Write-Host "Jacking in from: $Binary"
    Install-Binary $Binary
} else {
    $file = "$App-windows-x64.zip"
    if ($Version) { $url = "https://github.com/$Repo/releases/download/v$($Version.TrimStart('v'))/$file" }
    else { $url = "https://github.com/$Repo/releases/latest/download/$file" }
    $tmp = Join-Path ([IO.Path]::GetTempPath()) "capri_install_$([guid]::NewGuid().ToString('N'))"
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    try {
        Write-Host "Downloading $file from github.com/$Repo"
        try { Invoke-WebRequest -Uri $url -OutFile (Join-Path $tmp $file) -UseBasicParsing }
        catch {
            Write-Host "Download failed: $url" -ForegroundColor Red
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
    Write-Host "Keeping your existing $ConfigFile"
} else {
    @'
{
  // Capri settings (jsonc). Restart Capri to apply changes.
  // Env vars override these per launch: CAPRI_LOGO, CAPRI_CYBERPSYCOSIS.

  // none | low | medium | max. Also switchable in the TUI with /cyberpsycosis.
  "cyberpsycosis": "none",

  // Screen glitch rate multiplier: 1 = normal, 0 = off, 2 = double (max 10).
  "glitchProbability": 1,

  "logo": {
    // auto | image | quadrant | halfblock
    "style": "auto"
  },

  "hide": {
    // Show the model's reasoning as scrambled glyphs.
    "thinking": true,
    // Hide tool output, diffs and diagnostics.
    "toolResults": true,
    // Hide the lines that show a skill being loaded.
    "skills": true
  },

  "footer": {
    // Label for the default agent in the reply footer.
    "name": "Capri",
    // Show the model name in the footer and prompt box.
    "model": false,
    // Show tokens per second (also needs session.tps in tui.json).
    "tps": false
  }
}
'@ | Set-Content -Encoding UTF8 -Path $ConfigFile
    Write-Host "Wrote default settings to $ConfigFile"
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
    Write-Host "Installed skills to $SkillsDir"
} catch {
    Write-Host "Warning: could not install Capri skills (offline?). Capri works without them." -ForegroundColor Magenta
}

if (-not $NoModifyPath) {
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if (($userPath -split ";") -notcontains $InstallDir) {
        [Environment]::SetEnvironmentVariable("Path", ($userPath.TrimEnd(";") + ";" + $InstallDir).TrimStart(";"), "User")
        Write-Host "Added $InstallDir to your user PATH. Open a new terminal to use 'capri'."
    }
}

Write-Host ""
Write-Host "Capri installed: $Target" -ForegroundColor Green
Write-Host "Run: capri   (Windows Terminal recommended)"
