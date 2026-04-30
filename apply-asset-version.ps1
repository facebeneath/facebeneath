param(
  [string]$Version,
  [string]$Root = "."
)

$ErrorActionPreference = "Stop"

$rootPath = (Resolve-Path $Root).Path
$versionFile = Join-Path $rootPath "asset-version.txt"

if (-not (Test-Path $versionFile)) {
  throw "Missing asset-version.txt in $rootPath"
}

if ([string]::IsNullOrWhiteSpace($Version)) {
  $Version = [System.IO.File]::ReadAllText($versionFile, [System.Text.Encoding]::UTF8).Trim()
} else {
  [System.IO.File]::WriteAllText($versionFile, $Version + "`n", (New-Object System.Text.UTF8Encoding($false)))
}

if ($Version -notmatch '^\d{6,}$') {
  throw "Version must be numeric (example: 20260430). Current value: '$Version'"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$changed = @()

Get-ChildItem -Path $rootPath -Recurse -File -Filter *.html | ForEach-Object {
  $path = $_.FullName
  $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
  $updated = [System.Text.RegularExpressions.Regex]::Replace($content, '(?<=\?v=)\d+', $Version)

  if ($updated -ne $content) {
    [System.IO.File]::WriteAllText($path, $updated, $utf8NoBom)
    $changed += $path
  }
}

Write-Output "Version: $Version"
Write-Output "Changed files: $($changed.Count)"
$changed | ForEach-Object { $_.Replace($rootPath + "\\", "") }
