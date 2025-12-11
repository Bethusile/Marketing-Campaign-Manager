# PowerShell script to download vendor JS files into `public/vendor/`
# Run from the project root: `.	ools\fetch-vendor.ps1` or use the npm script `npm run vendor:fetch`

# Download into src/vendor so Vite can pick them up and bundle them.
$vendorDir = Join-Path -Path $PSScriptRoot -ChildPath "..\src\vendor" | Resolve-Path -ErrorAction SilentlyContinue
if (-not $vendorDir) {
  $vendorDir = Join-Path -Path $PSScriptRoot -ChildPath "..\src\vendor"
  New-Item -ItemType Directory -Path $vendorDir -Force | Out-Null
}

$files = @(
  @{ url = 'https://aframe.io/releases/1.5.0/aframe.min.js'; name = 'aframe.min.js' },
  @{ url = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js'; name = 'mindar-image-aframe.prod.js' }
)

foreach ($f in $files) {
  $out = Join-Path -Path $vendorDir -ChildPath $f.name
  Write-Host "Downloading $($f.url) -> $out"
  try {
    Invoke-WebRequest -Uri $f.url -OutFile $out -UseBasicParsing -ErrorAction Stop
    Write-Host "Saved $out"
  } catch {
    Write-Warning "Failed to download $($f.url): $_"
  }
}
