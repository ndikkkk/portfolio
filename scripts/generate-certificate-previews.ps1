param([string]$Root = (Split-Path -Parent $PSScriptRoot))
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfPageRenderOptions, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1
} | Select-Object -First 1
$asActionTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1
} | Select-Object -First 1
function Wait-Result($operation, $type) {
    $task = $asTask.MakeGenericMethod($type).Invoke($null, @($operation))
    $task.Wait()
    return $task.Result
}
$profile = Get-Content -LiteralPath (Join-Path $root 'src\data\profile.ts') -Raw
$entries = [regex]::Matches($profile, 'image: "(/photos/certificate-[^"]+)",\s+url: "([^"]+)"')
foreach ($entry in $entries) {
    $source = Join-Path $root ('public' + [Uri]::UnescapeDataString($entry.Groups[2].Value))
    $destination = Join-Path $root ('public' + $entry.Groups[1].Value)
    $file = Wait-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($source)) ([Windows.Storage.StorageFile])
    $document = Wait-Result ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
    $page = $document.GetPage(0)
    $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
    try {
        $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
        $options.DestinationWidth = 960
        $action = $page.RenderToStreamAsync($stream, $options)
        $asActionTask.Invoke($null, @($action)).Wait()
        $reader = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
        $reader.Position = 0
        $output = [System.IO.File]::Create($destination)
        try { $reader.CopyTo($output) } finally { $output.Dispose() }
        Write-Output "Created $destination"
    } finally {
        $stream.Dispose()
        $page.Dispose()
    }
}
if ($entries.Count -eq 0) { throw 'Tidak ada data gambar preview sertifikat.' }
Write-Output 'PREVIEWS_OK'