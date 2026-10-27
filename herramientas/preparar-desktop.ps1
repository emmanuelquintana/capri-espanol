$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$repos = Get-Content -LiteralPath (Join-Path $taskRoot 'repositorios.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$repo = $repos | Where-Object { $_.repository -eq 'mochiiwuff/capri-desktop' }
if (-not $repo -or $repo.commit -ne 'f8395800976b4c787ec088d6fead140a934875fb') { throw 'Referencia de assets inesperada.' }
$inventory = Get-Content -LiteralPath (Join-Path $taskRoot 'analisis/assets.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$entries = @($inventory | Where-Object { $_.repository -eq $repo.repository -and $_.path.StartsWith('assets/') })
if ($entries.Count -ne 27) { throw ('Revisar el inventario de assets: ' + $entries.Count) }
$archive = Join-Path $taskRoot ('descargas/' + $repo.slug + '.zip')
if (-not (Test-Path -LiteralPath $archive)) {
    New-Item -ItemType Directory -Path (Split-Path -Parent $archive) -Force | Out-Null
    Invoke-WebRequest -Uri $repo.archive -OutFile $archive -UseBasicParsing
}
if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ne $repo.archiveSha256) { throw 'El ZIP no coincide con la referencia.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead($archive)
try {
    $prefix = ($zip.Entries[0].FullName -split '/')[0] + '/'
    $assetRoot = [IO.Path]::GetFullPath((Join-Path $taskRoot 'app/assets'))
    foreach ($entry in $entries) {
        $target = [IO.Path]::GetFullPath((Join-Path $taskRoot ('app/' + $entry.path)))
        if (-not $target.StartsWith($assetRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Ruta de asset no permitida.' }
        $member = $zip.GetEntry($prefix + $entry.path)
        if (-not $member) { throw ('Asset ausente: ' + $entry.path) }
        New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
        $inputStream = $member.Open()
        try { $outputStream = [IO.File]::Create($target); try { $inputStream.CopyTo($outputStream) } finally { $outputStream.Dispose() } } finally { $inputStream.Dispose() }
        if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $entry.sha256) { throw ('Asset distinto: ' + $entry.path) }
    }
} finally { $zip.Dispose() }
Write-Output ('Assets originales comprobados: ' + $entries.Count)
