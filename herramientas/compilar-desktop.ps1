param([switch]$SkipInstall)
$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
& (Join-Path $PSScriptRoot 'preparar-desktop.ps1')
Push-Location (Join-Path $taskRoot 'app')
try {
    if (-not $SkipInstall) {
        & npm.cmd ci --ignore-scripts
        if ($LASTEXITCODE -ne 0) { throw 'No se pudieron instalar las dependencias.' }
        & node.exe node_modules/electron/install.js
        if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar Electron.' }
    }
    & npm.cmd test
    if ($LASTEXITCODE -ne 0) { throw 'Las pruebas no pasan.' }
    $env:CSC_IDENTITY_AUTO_DISCOVERY = 'false'
    & npm.cmd run dist
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo compilar el instalador.' }
    $package = Get-Content package.json -Raw -Encoding UTF8 | ConvertFrom-Json
    $installer = Join-Path $taskRoot ('entrega-desktop/Capri-Espanol-Setup-' + $package.version + '.exe')
    if (-not (Test-Path -LiteralPath $installer)) { throw 'No se encontro el instalador esperado.' }
    $hash = (Get-FileHash -LiteralPath $installer -Algorithm SHA256).Hash.ToLowerInvariant()
    [IO.File]::WriteAllText((Join-Path $taskRoot 'entrega-desktop/SHA256SUMS.txt'), $hash + '  ' + (Split-Path -Leaf $installer) + "`n", [Text.UTF8Encoding]::new($false))
    Write-Output $installer
    Write-Output ('SHA-256: ' + $hash)
} finally { Pop-Location }
