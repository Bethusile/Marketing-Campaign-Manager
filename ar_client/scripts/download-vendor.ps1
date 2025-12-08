# Run this from the `ar_client` folder.
# It downloads A-Frame and MindAR into `public/vendor`

$vendorDir = Join-Path -Path (Get-Location) -ChildPath "public\vendor"
if (-not (Test-Path $vendorDir)) { New-Item -ItemType Directory -Path $vendorDir | Out-Null }

$aframeUrl = 'https://aframe.io/releases/1.5.0/aframe.min.js'
$mindarUrl = 'https://unpkg.com/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js'

Write-Host "Downloading A-Frame from $aframeUrl"
Invoke-WebRequest -Uri $aframeUrl -OutFile (Join-Path $vendorDir 'aframe.min.js') -UseBasicParsing

Write-Host "Downloading MindAR from $mindarUrl"
Invoke-WebRequest -Uri $mindarUrl -OutFile (Join-Path $vendorDir 'mindar-image-aframe.prod.js') -UseBasicParsing

Write-Host "Downloads complete. Vendor files placed in: $vendorDir"
