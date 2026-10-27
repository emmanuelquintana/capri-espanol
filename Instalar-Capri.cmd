@echo off
setlocal
set "CAPRI_INSTALLER_FILE=%~f0"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -ExecutionPolicy Bypass -STA -Command "$raw=[IO.File]::ReadAllText($env:CAPRI_INSTALLER_FILE,[Text.Encoding]::UTF8); $body=($raw -split '(?m)^# POWERSHELL\r?$',2)[1]; & ([scriptblock]::Create($body))"
exit /b %errorlevel%
# POWERSHELL
param(
    [string]$InstallDir = (Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'Programs\Capri'),
    [string]$PackageDirectory = '',
    [switch]$Unattended,
    [switch]$NoShortcuts,
    [switch]$NoLaunch
)
$ErrorActionPreference = 'Stop'
$script:SourceDirectory = if ($PackageDirectory) { [IO.Path]::GetFullPath($PackageDirectory) } else { Split-Path -Parent $env:CAPRI_INSTALLER_FILE }
$script:Destination = [IO.Path]::GetFullPath($InstallDir)
$script:DownloadedPackage = $null

function Find-Package {
    $candidates = @($script:SourceDirectory, (Join-Path $script:SourceDirectory 'entrega\Capri-amigable-windows-x64'))
    foreach ($candidate in $candidates) {
        if ((Test-Path -LiteralPath (Join-Path $candidate 'capri-es.exe')) -and (Test-Path -LiteralPath (Join-Path $candidate 'BUILDINFO.json'))) { return $candidate }
    }
    if ($PackageDirectory) { throw 'No se encontró el paquete completo en la carpeta indicada.' }
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $script:DownloadedPackage = Join-Path ([IO.Path]::GetTempPath()) ('capri-instalar-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $script:DownloadedPackage | Out-Null
    $archive = Join-Path $script:DownloadedPackage 'Capri.zip'
    $client = New-Object Net.WebClient
    try {
        $client.Headers.Add('User-Agent', 'Capri-espanol-installer')
        $download = $client.DownloadFileTaskAsync('https://github.com/emmanuelquintana/capri-espanol/releases/download/v0.3.0-es.1/Capri-amigable-windows-x64.zip', $archive)
        $watch = [Diagnostics.Stopwatch]::StartNew()
        while (-not $download.IsCompleted) {
            if (-not $Unattended) { [Windows.Forms.Application]::DoEvents() }
            if ($watch.Elapsed.TotalMinutes -gt 5) { $client.CancelAsync(); throw 'La descarga tardó demasiado. Comprueba internet y vuelve a intentarlo.' }
            Start-Sleep -Milliseconds 100
        }
        $download.GetAwaiter().GetResult()
    } catch { throw 'No se pudo descargar nuestra edición de Capri. Comprueba internet o descarga y extrae el ZIP de emmanuelquintana/capri-espanol antes de instalar.' }
    finally { $client.Dispose() }
    Expand-Archive -LiteralPath $archive -DestinationPath $script:DownloadedPackage -Force
    $package = Join-Path $script:DownloadedPackage 'Capri-amigable-windows-x64'
    if (-not (Test-Path -LiteralPath (Join-Path $package 'BUILDINFO.json'))) { throw 'La descarga está incompleta. Vuelve a intentarlo.' }
    return $package
}

function Remove-DownloadedPackage {
    if (-not $script:DownloadedPackage) { return }
    $resolved = [IO.Path]::GetFullPath($script:DownloadedPackage)
    $prefix = [IO.Path]::GetFullPath((Join-Path ([IO.Path]::GetTempPath()) 'capri-instalar-'))
    if ($resolved.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) -and (Split-Path -Leaf $resolved) -match '^capri-instalar-[a-f0-9]{32}$') { Remove-Item -LiteralPath $resolved -Recurse -Force -ErrorAction SilentlyContinue }
}

function Install-Capri([scriptblock]$Progress) {
    if (-not [Environment]::Is64BitOperatingSystem -or $env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { throw 'Este paquete está preparado para Windows de 64 bits (x64).' }
    $root = [IO.Path]::GetPathRoot($script:Destination)
    if ($script:Destination.TrimEnd('\') -eq $root.TrimEnd('\') -or $script:Destination.TrimEnd('\') -eq $env:USERPROFILE.TrimEnd('\')) { throw 'Elige una carpeta dedicada para Capri.' }
    & $Progress 10 'Preparando Capri. Si hace falta descargarla, puede tardar unos minutos…'
    $package = Find-Package
    $binary = Join-Path $package 'capri-es.exe'
    $manifest = Get-Content -LiteralPath (Join-Path $package 'BUILDINFO.json') -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($manifest.sha256 -notmatch '^[a-fA-F0-9]{64}$') { throw 'El archivo de comprobación no es válido. Vuelve a descargar el paquete completo.' }
    if ((Get-FileHash -LiteralPath $binary -Algorithm SHA256).Hash -ne $manifest.sha256) { throw 'El programa no coincide con su archivo de comprobación. Vuelve a descargar el paquete completo.' }
    & $Progress 35 'Instalando Capri y su motor…'
    New-Item -ItemType Directory -Path $script:Destination -Force | Out-Null
    $target = Join-Path $script:Destination 'capri.exe'
    $staged = Join-Path $script:Destination 'capri.exe.new'
    Copy-Item -LiteralPath $binary -Destination $staged -Force
    if ((Get-FileHash -LiteralPath $staged -Algorithm SHA256).Hash -ne $manifest.sha256) { throw 'No se pudo comprobar la copia. Libera espacio en el disco y vuelve a intentarlo.' }
    if (Test-Path -LiteralPath $target) {
        try { Move-Item -LiteralPath $target -Destination (Join-Path $script:Destination 'capri-anterior.exe') -Force }
        catch { throw 'Cierra Capri y vuelve a instalar. Tus conversaciones se conservarán.' }
    }
    try { Move-Item -LiteralPath $staged -Destination $target -Force }
    catch {
        $previous = Join-Path $script:Destination 'capri-anterior.exe'
        if ((Test-Path -LiteralPath $previous) -and -not (Test-Path -LiteralPath $target)) { Move-Item -LiteralPath $previous -Destination $target }
        throw 'No se pudo completar la instalación. Se conserva la versión anterior; cierra Capri y vuelve a intentarlo.'
    }
    foreach ($name in @('LICENSE', 'BUILDINFO.json', 'LEEME.md')) {
        if (Test-Path -LiteralPath (Join-Path $package $name)) { Copy-Item -LiteralPath (Join-Path $package $name) -Destination (Join-Path $script:Destination $name) -Force }
    }
    $launcher = @'
$ErrorActionPreference = 'Stop'
try {
    & (Join-Path $PSScriptRoot 'capri.exe') amigable
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo abrir Capri.' }
} catch {
    Add-Type -AssemblyName System.Windows.Forms
    [Windows.Forms.MessageBox]::Show('Capri no pudo abrirse. Cierra otras ventanas de Capri y vuelve a intentarlo. Si continúa, ejecuta el instalador de nuevo; tus charlas se conservarán.', 'Capri', 'OK', 'Warning') | Out-Null
    exit 1
}
'@
    $launcherPath = Join-Path $script:Destination 'Abrir-Capri.ps1'
    $launcher | Set-Content -LiteralPath $launcherPath -Encoding UTF8
    & $Progress 80 'Preparando tus accesos directos…'
    if (-not $NoShortcuts) {
        $shell = New-Object -ComObject WScript.Shell
        foreach ($folder in @([Environment]::GetFolderPath('Desktop'), [Environment]::GetFolderPath('Programs'))) {
            if (-not $folder) { continue }
            $shortcut = $shell.CreateShortcut((Join-Path $folder 'Capri en español.lnk'))
            $shortcut.TargetPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
            $shortcut.Arguments = '-NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $launcherPath + '"'
            $shortcut.WorkingDirectory = $script:Destination
            $shortcut.Description = 'Conversar con Capri en español'
            $shortcut.IconLocation = $target + ',0'
            $shortcut.Save()
        }
    }
    & $Progress 100 'Listo. Capri ya tiene un lugar en tu equipo.'
    if (-not $NoLaunch) { Start-Process -FilePath (Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe') -ArgumentList ('-NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $launcherPath + '"') -WindowStyle Hidden }
    return $target
}

if ($Unattended) {
    try { Install-Capri { param($value, $message) Write-Output $message } | Write-Output; exit 0 }
    catch { Write-Error $_.Exception.Message; exit 1 }
    finally { Remove-DownloadedPackage }
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[Windows.Forms.Application]::EnableVisualStyles()
$form = New-Object Windows.Forms.Form
$form.Text = 'Instalar Capri en español'
$form.StartPosition = 'CenterScreen'
$form.ClientSize = New-Object Drawing.Size(600, 520)
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.BackColor = [Drawing.Color]::FromArgb(13, 18, 16)
$form.ForeColor = [Drawing.Color]::FromArgb(237, 245, 239)
$form.Font = New-Object Drawing.Font('Segoe UI', 10)
$form.AutoScaleMode = [Windows.Forms.AutoScaleMode]::Dpi

function Add-Label([string]$Text, [int]$Y, [int]$Height, [single]$Size, [bool]$Strong) {
    $label = New-Object Windows.Forms.Label
    $label.Text = $Text
    $label.Location = New-Object Drawing.Point(36, $Y)
    $label.Size = New-Object Drawing.Size(528, $Height)
    $label.Font = New-Object Drawing.Font('Segoe UI', $Size, $(if ($Strong) { [Drawing.FontStyle]::Bold } else { [Drawing.FontStyle]::Regular }))
    $form.Controls.Add($label)
    return $label
}
$brand = Add-Label 'CAPRI / EN ESPAÑOL' 28 28 11 $true
$brand.ForeColor = [Drawing.Color]::FromArgb(99, 245, 148)
$title = Add-Label 'Tu próxima charla empieza aquí.' 78 78 25 $true
$description = Add-Label "Un chat con Capri, con bienvenida guiada y sin comandos.`r`nIncluye el programa y su motor. No necesitas instalar nada más." 172 70 11 $false
$account = Add-Label 'Para conversar, conectarás tu propio servicio de IA desde una pantalla sencilla. La clave de acceso se configura dentro de Capri.' 255 58 10 $false
$account.ForeColor = [Drawing.Color]::FromArgb(169, 185, 173)
$location = Add-Label ('Se instalará para tu usuario en: ' + $script:Destination) 325 42 9 $false
$location.ForeColor = [Drawing.Color]::FromArgb(169, 185, 173)
$progress = New-Object Windows.Forms.ProgressBar
$progress.Location = New-Object Drawing.Point(36, 380)
$progress.Size = New-Object Drawing.Size(528, 8)
$form.Controls.Add($progress)
$status = Add-Label 'Sin permisos de administrador. Tus conversaciones se conservan al actualizar.' 399 35 9 $false
$status.ForeColor = [Drawing.Color]::FromArgb(169, 185, 173)
$button = New-Object Windows.Forms.Button
$button.Text = 'Instalar y abrir Capri'
$button.AccessibleName = 'Instalar y abrir Capri'
$button.Location = New-Object Drawing.Point(36, 448)
$button.Size = New-Object Drawing.Size(528, 46)
$button.FlatStyle = 'Flat'
$button.BackColor = [Drawing.Color]::FromArgb(99, 245, 148)
$button.ForeColor = [Drawing.Color]::FromArgb(9, 32, 20)
$button.Font = New-Object Drawing.Font('Segoe UI', 11, [Drawing.FontStyle]::Bold)
$form.Controls.Add($button)
$form.AcceptButton = $button
$script:Finished = $false
$button.Add_Click({
    if ($script:Finished) { $form.Close(); return }
    $button.Enabled = $false
    $form.ControlBox = $false
    try {
        $null = Install-Capri { param($value, $message) $progress.Value = $value; $status.Text = $message; $form.Refresh(); [Windows.Forms.Application]::DoEvents() }
        $script:Finished = $true
        $title.Text = 'Listo. Capri te espera.'
        $description.Text = 'Encontrarás Capri en el escritorio y en el menú Inicio. La primera conexión se hace desde su propia interfaz.'
        $button.Text = 'Cerrar instalador'
        $button.AccessibleName = 'Cerrar instalador'
    } catch { [Windows.Forms.MessageBox]::Show($_.Exception.Message, 'No se pudo instalar Capri', 'OK', 'Warning') | Out-Null; $status.Text = 'No se completó la instalación. Puedes volver a intentarlo.' }
    finally { $button.Enabled = $true; $form.ControlBox = $true; Remove-DownloadedPackage }
})
[void]$form.ShowDialog()
