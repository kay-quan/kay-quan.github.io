<#
.SYNOPSIS
  Resize photos for the web and print ready-to-paste photos.js entries.

.DESCRIPTION
  Full-size exports are far too heavy for a website. A 12 MB JPEG straight out
  of Lightroom will make the gallery crawl on phone data, and GitHub starts
  complaining well before you've uploaded a festival's worth of them.

  This shrinks each photo to a sensible long edge, re-encodes it at a quality
  that still looks good, and prints the exact photos.js entry — including the
  width and height, which you'd otherwise have to look up by hand.

  Re-encoding also drops EXIF, so GPS coordinates from your camera or phone
  don't get published along with the picture.

  Uses only what ships with Windows. No Python, no Node, nothing to install.

.EXAMPLE
  .\tools\resize-photos.ps1 -Source "C:\Exports\Osheaga" -Category festivals -Event "Osheaga 2025"

.EXAMPLE
  .\tools\resize-photos.ps1 -Source "C:\Exports\hero.jpg" -Category hero -MaxEdge 2800
#>

[CmdletBinding()]
param(
  # Folder of photos, or a single image file.
  [Parameter(Mandatory = $true)]
  [string]$Source,

  # Which gallery folder these belong in.
  [Parameter(Mandatory = $true)]
  [ValidateSet('festivals', 'clubs', 'portraits', 'weddings', 'food', 'hero')]
  [string]$Category,

  # Festival/event label, used for the filter chips. Festivals only.
  [string]$Event = "",

  # Longest edge in pixels. 2400 is plenty for a full-screen lightbox.
  [int]$MaxEdge = 2400,

  # JPEG quality, 1-100. 82 is a good balance; go to 88 for the hero.
  [ValidateRange(1, 100)]
  [int]$Quality = 82
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $root "assets\img\$Category"

if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }

# Gather input files
if (Test-Path $Source -PathType Leaf) {
  $files = @(Get-Item $Source)
} else {
  $files = Get-ChildItem -Path $Source -File |
           Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|tif|tiff|bmp)$' } |
           Sort-Object Name
}

if (-not $files -or $files.Count -eq 0) {
  Write-Warning "No images found in $Source"
  return
}

# JPEG encoder + quality parameter
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

# Cameras record orientation in EXIF rather than rotating the pixels, and
# System.Drawing ignores it — without this, every portrait frame comes out
# lying on its side.
function Apply-Exif-Orientation {
  param([System.Drawing.Image]$Image)
  $ORIENT = 0x0112
  if ($Image.PropertyIdList -notcontains $ORIENT) { return }
  $value = $Image.GetPropertyItem($ORIENT).Value[0]
  switch ($value) {
    2 { $Image.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
    3 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
    4 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
    5 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
    6 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    7 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
    8 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
  }
  $Image.RemovePropertyItem($ORIENT)
}

$entries = @()
$totalIn = 0
$totalOut = 0

foreach ($file in $files) {
  $src = $null; $canvas = $null; $gfx = $null
  try {
    $src = [System.Drawing.Image]::FromFile($file.FullName)
    Apply-Exif-Orientation -Image $src

    $w = $src.Width
    $h = $src.Height
    $scale = [Math]::Min(1.0, $MaxEdge / [Math]::Max($w, $h))
    $nw = [int][Math]::Round($w * $scale)
    $nh = [int][Math]::Round($h * $scale)

    $canvas = New-Object System.Drawing.Bitmap($nw, $nh)
    $canvas.SetResolution(72, 72)

    $gfx = [System.Drawing.Graphics]::FromImage($canvas)
    $gfx.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $gfx.DrawImage($src, 0, 0, $nw, $nh)

    # lower-case, spaces to hyphens, always .jpg
    $name = ($file.BaseName.ToLower() -replace '[^a-z0-9]+', '-').Trim('-') + '.jpg'
    $out = Join-Path $dest $name

    $canvas.Save($out, $codec, $encParams)

    $inKB  = [Math]::Round($file.Length / 1KB)
    $outKB = [Math]::Round((Get-Item $out).Length / 1KB)
    $totalIn += $inKB
    $totalOut += $outKB

    Write-Host ("  {0,-34} {1}x{2}  {3} KB -> {4} KB" -f $name, $nw, $nh, $inKB, $outKB)

    $eventLine = if ($Category -eq 'festivals' -and $Event) { "`n    event: `"$Event`"," } else { "" }
    $entries += @"
  { src: "assets/img/$Category/$name", w: $nw, h: $nh,
    title: "TODO caption",$eventLine
    category: "$Category" },
"@
  }
  catch {
    Write-Warning "Skipped $($file.Name): $($_.Exception.Message)"
  }
  finally {
    if ($gfx)    { $gfx.Dispose() }
    if ($canvas) { $canvas.Dispose() }
    if ($src)    { $src.Dispose() }
  }
}

Write-Host ""
Write-Host "Done. $($entries.Count) image(s) -> assets\img\$Category"
Write-Host "Total: $totalIn KB -> $totalOut KB"
Write-Host ""

if ($Category -eq 'hero') {
  Write-Host "Hero image in place. If you renamed it, update window.HERO in assets\js\photos.js."
  return
}

Write-Host "--------------------------------------------------------------"
Write-Host " Paste into the $($Category.ToUpper()) section of assets\js\photos.js"
Write-Host " (then replace each 'TODO caption')"
Write-Host "--------------------------------------------------------------"
Write-Host ""
$entries -join "`n" | Write-Host
