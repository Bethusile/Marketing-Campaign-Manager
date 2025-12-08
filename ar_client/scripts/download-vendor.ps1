# It downloads A-Frame and MindAR into `src/vendor` so the bundler can include them

$srcVendorDir = Join-Path -Path (Get-Location) -ChildPath "src\vendor"
if (-not (Test-Path $srcVendorDir)) { New-Item -ItemType Directory -Path $srcVendorDir | Out-Null }

$aframeUrl = 'https://aframe.io/releases/1.5.0/aframe.min.js'
$mindarUrl = 'https://unpkg.com/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js'

Write-Host "Downloading A-Frame from $aframeUrl"
$aframeOut = Join-Path $srcVendorDir 'aframe.min.js'
Invoke-WebRequest -Uri $aframeUrl -OutFile $aframeOut -UseBasicParsing

Write-Host "Downloading MindAR from $mindarUrl"
$mindarOut = Join-Path $srcVendorDir 'mindar-image-aframe.prod.js'
Invoke-WebRequest -Uri $mindarUrl -OutFile $mindarOut -UseBasicParsing

Write-Host "Downloads complete. Vendor files placed in: $srcVendorDir"
