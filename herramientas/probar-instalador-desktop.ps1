$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$package = Get-Content -LiteralPath (Join-Path $taskRoot 'app/package.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$installer = Join-Path $taskRoot ('entrega-desktop/Capri-Espanol-Setup-' + $package.version + '.exe')
$destination = [IO.Path]::GetFullPath((Join-Path $taskRoot 'entrega-desktop/prueba-instalacion'))
if (-not $destination.StartsWith($taskRoot + '\', [StringComparison]::OrdinalIgnoreCase) -or (Test-Path -LiteralPath $destination)) { throw 'La carpeta de prueba debe ser nueva y permanecer dentro del proyecto.' }
$productName = $package.build.productName
$prior = Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*' -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -eq $productName }
if ($prior) { throw 'Ya hay una instalacion personal de esta edicion. Se conserva; ejecutar QA sobre win-unpacked.' }
$shortcuts = @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs')) | ForEach-Object { Join-Path $_ ($productName + '.lnk') }
$saved = @{}
foreach ($file in $shortcuts) { if (Test-Path -LiteralPath $file) { $saved[$file] = [IO.File]::ReadAllBytes($file) } }
$previousProfile = $env:CAPRI_ES_PROFILE
$env:CAPRI_ES_PROFILE = Join-Path $taskRoot 'qa-desktop/perfiles/instalador'
try {
    # NSIS requiere /D como ultimo argumento y sin comillas, incluso si hay espacios.
    $process = Start-Process -FilePath $installer -ArgumentList ('/S /currentuser /D=' + $destination) -WindowStyle Hidden -PassThru -Wait
    if ($process.ExitCode -ne 0) { throw ('El instalador devolvio ' + $process.ExitCode) }
    $installed = Join-Path $destination 'CapriEspanol.exe'
    $reference = Join-Path $taskRoot 'entrega-desktop/win-unpacked/CapriEspanol.exe'
    if ((Get-FileHash -LiteralPath $installed -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $reference -Algorithm SHA256).Hash) { throw 'El ejecutable instalado es distinto.' }
    $asar = Join-Path $destination 'resources/app.asar'
    if ((Get-FileHash -LiteralPath $asar -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath (Join-Path $taskRoot 'entrega-desktop/win-unpacked/resources/app.asar') -Algorithm SHA256).Hash) { throw 'Los recursos instalados son distintos.' }
    & node.exe (Join-Path $PSScriptRoot 'qa-desktop.cjs') $installed
    if ($LASTEXITCODE -ne 0) { throw 'La prueba de la app instalada no paso.' }
    Write-Output 'PASS: instalador NSIS, ejecutable y recursos identicos; QA completo sobre la app instalada.'
} finally {
    $uninstallers = @(Get-ChildItem -LiteralPath $destination -Filter 'Uninstall*.exe' -ErrorAction SilentlyContinue)
    if ($uninstallers.Count -eq 1 -and [IO.Path]::GetFullPath($uninstallers[0].DirectoryName) -eq $destination) {
        $process = Start-Process -FilePath $uninstallers[0].FullName -ArgumentList '/S' -WindowStyle Hidden -Wait -PassThru
        for ($attempt = 0; $attempt -lt 30 -and (Test-Path -LiteralPath (Join-Path $destination 'CapriEspanol.exe')); $attempt++) { Start-Sleep -Milliseconds 500 }
    }
    foreach ($file in $shortcuts) { if ($saved.ContainsKey($file)) { [IO.File]::WriteAllBytes($file, $saved[$file]) } }
    $env:CAPRI_ES_PROFILE = $previousProfile
}
if (Test-Path -LiteralPath (Join-Path $destination 'CapriEspanol.exe')) { throw 'La desinstalacion de prueba no termino.' }
Write-Output 'PASS: instalacion de prueba retirada; accesos directos anteriores conservados.'
