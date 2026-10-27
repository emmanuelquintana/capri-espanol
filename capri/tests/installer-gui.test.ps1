param(
    [string]$InstallerPath = (Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) 'Instalar-Capri.cmd'),
    [string]$PackageDirectory = ''
)
$ErrorActionPreference = 'Stop'
$testRoot = Join-Path ([IO.Path]::GetTempPath()) ('capri-gui-test-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $testRoot | Out-Null
$testCompiledPackage = [bool]$PackageDirectory
$package = if ($testCompiledPackage) { [IO.Path]::GetFullPath($PackageDirectory) } else { Join-Path $testRoot 'package' }
$destination = Join-Path $testRoot 'installed'
if (-not $testCompiledPackage) {
    New-Item -ItemType Directory -Path $package | Out-Null
    [IO.File]::WriteAllBytes((Join-Path $package 'capri-es.exe'), [byte[]](77,90,67,65,80,82,73))
}
$digest = (Get-FileHash -LiteralPath (Join-Path $package 'capri-es.exe') -Algorithm SHA256).Hash
if (-not $testCompiledPackage) { @{ sha256 = $digest } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $package 'BUILDINFO.json') -Encoding UTF8 }
$source = [IO.File]::ReadAllText([IO.Path]::GetFullPath($InstallerPath), [Text.Encoding]::UTF8)
$body = ($source -split '(?m)^# POWERSHELL\r?$',2)[1]
if (-not $body) { throw 'Missing installer body.' }
# Capture the actual click handler's error without opening a blocking message box in CI.
$errorDialog = "[Windows.Forms.MessageBox]::Show(`$_.Exception.Message, 'No se pudo instalar Capri', 'OK', 'Warning') | Out-Null"
if (-not $body.Contains($errorDialog)) { throw 'GUI error handler changed; update the non-modal test interception.' }
$body = $body.Replace($errorDialog, '$script:GuiTestError = $_')
$end = @'
$form.ShowInTaskbar = $false
$form.StartPosition = 'Manual'
$form.Location = New-Object Drawing.Point(-20000, -20000)
$script:GuiTestError = $null
try {
    $form.Show()
    [Windows.Forms.Application]::DoEvents()
    $button.PerformClick()
    [Windows.Forms.Application]::DoEvents()
    if ($script:GuiTestError) { throw $script:GuiTestError }
    if (-not $script:Finished) { throw 'The GUI did not finish installation.' }
    $bars = @($form.Controls | Where-Object { $_ -is [Windows.Forms.ProgressBar] })
    if ($bars.Count -ne 1 -or $bars[0].Value -ne 100) { throw 'The real progress control did not reach 100.' }
    $installed = Join-Path $script:Destination 'capri.exe'
    if (-not (Test-Path -LiteralPath $installed)) { throw 'The click handler did not install the file.' }
    if ((Get-FileHash -LiteralPath $installed -Algorithm SHA256).Hash -ne $digest) { throw 'Installed bytes differ.' }
    if ($testCompiledPackage) {
        $testManifest = Get-Content -LiteralPath (Join-Path $package 'BUILDINFO.json') -Raw -Encoding UTF8 | ConvertFrom-Json
        if ((& $installed --version) -ne ('capri v' + $testManifest.version)) { throw 'Installed binary version differs.' }
        Write-Output ('PASS: installed compiled package version ' + $testManifest.version)
    }
    Write-Output 'PASS: real GUI button, progress=100, installed bytes verified, no shortcuts or app window.'
} finally { $form.Close(); $form.Dispose() }
'@
if (-not $body.Contains('[void]$form.ShowDialog()')) { throw 'GUI entry point changed; update the click test.' }
$body = $body.Replace('[void]$form.ShowDialog()', $end)
try {
    & ([scriptblock]::Create($body)) -InstallDir $destination -PackageDirectory $package -NoShortcuts -NoLaunch
} finally {
    $resolved = [IO.Path]::GetFullPath($testRoot)
    $prefix = [IO.Path]::GetFullPath((Join-Path ([IO.Path]::GetTempPath()) 'capri-gui-test-'))
    if ($resolved.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) -and (Split-Path -Leaf $resolved) -match '^capri-gui-test-[a-f0-9]{32}$') { Remove-Item -LiteralPath $resolved -Recurse -Force }
}
