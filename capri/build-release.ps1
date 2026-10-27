param([switch]$SkipInstall, [switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$project = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'project.json') -Raw | ConvertFrom-Json
if ($project.version -notmatch '^\d+\.\d+\.\d+-es\.\d+$') { throw 'Versión de proyecto no válida.' }
$bun = Get-Command bun -ErrorAction Stop
if (-not $SkipBuild -and ((& $bun.Source --version) -ne $project.bun)) { throw ('Usa Bun ' + $project.bun + ' para reproducir esta compilación.') }
Push-Location $taskRoot
try {
    if (-not $SkipInstall -and -not $SkipBuild) {
        & $bun.Source install --frozen-lockfile --ignore-scripts
        if ($LASTEXITCODE -ne 0) { throw 'Falló la instalación de dependencias.' }
    }
    if (-not $SkipBuild) {
        $env:OPENCODE_VERSION = $project.version
        $env:OPENCODE_CHANNEL = 'es'
        Push-Location (Join-Path $taskRoot 'packages\cli')
        try {
            $buildOutput = [IO.Path]::GetFullPath((Join-Path (Get-Location) 'dist'))
            if ($buildOutput -ne (Join-Path $taskRoot 'packages\cli\dist')) { throw 'Directorio de compilación inesperado.' }
            & $bun.Source run script/build.ts --single --skip-install --skip-web-ui
            if ($LASTEXITCODE -ne 0) { throw 'Falló la compilación.' }
        } finally { Pop-Location }
    }
    $binary = Join-Path $taskRoot 'packages\cli\dist\cli-windows-x64\bin\opencode.exe'
    if ((& $binary --version) -ne ('capri v' + $project.version)) { throw 'El ejecutable no corresponde a la versión declarada.' }
    $bundle = [IO.Path]::GetFullPath((Join-Path $taskRoot 'entrega\Capri-amigable-windows-x64'))
    $expected = Join-Path $taskRoot 'entrega\Capri-amigable-windows-x64'
    if ($bundle -ne $expected -or -not $bundle.StartsWith($taskRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Directorio de entrega inesperado.' }
    if (Test-Path -LiteralPath $bundle) {
        if ((Get-Item -LiteralPath $bundle).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'La entrega no puede ser un enlace a otra carpeta.' }
        Remove-Item -LiteralPath $bundle -Recurse -Force
    }
    New-Item -ItemType Directory -Path $bundle -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $bundle 'licencias') -Force | Out-Null
    Copy-Item -LiteralPath $binary -Destination (Join-Path $bundle 'capri-es.exe')
    Copy-Item -LiteralPath 'Instalar-Capri.cmd','LICENSE','NOTICE.md' -Destination $bundle
    Copy-Item -LiteralPath 'capri\docs\GUIA-AMIGABLE.md' -Destination (Join-Path $bundle 'LEEME.md')
    Copy-Item -LiteralPath 'capri\docs\VALIDACION-AMIGABLE.md' -Destination $bundle
    Copy-Item -LiteralPath 'packages\ui\LICENSE' -Destination (Join-Path $bundle 'licencias\OpenCode-ui-LICENSE.txt')
    $hash = (Get-FileHash -LiteralPath (Join-Path $bundle 'capri-es.exe') -Algorithm SHA256).Hash.ToLowerInvariant()
    [ordered]@{ name = $project.name; edition = $project.edition; version = $project.version; platform = $project.platform; repository = ('https://github.com/' + $project.repository); upstream = ('https://github.com/' + $project.upstream); upstreamCommit = $project.upstreamCommit; bun = $project.bun; sha256 = $hash; builtAtUtc = [DateTime]::UtcNow.ToString('o'); validation = 'Consultar VALIDACION-AMIGABLE.md' } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $bundle 'BUILDINFO.json') -Encoding UTF8
    $zip = Join-Path $taskRoot 'Capri-amigable-windows-x64.zip'
    Compress-Archive -LiteralPath $bundle -DestinationPath $zip -CompressionLevel Optimal -Force
    $zipHash = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLowerInvariant()
    ($zipHash + '  Capri-amigable-windows-x64.zip') | Set-Content -LiteralPath (Join-Path $taskRoot 'entrega\SHA256SUMS.txt') -Encoding ASCII
    Write-Output $zip
    Write-Output ('SHA-256: ' + $zipHash)
} finally { Pop-Location }
