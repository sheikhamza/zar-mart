Add-Type -AssemblyName System.Drawing

function Create-Icon {
  param([int]$Size, [string]$Path)
  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::FromArgb(245, 130, 32))
  $font = New-Object System.Drawing.Font('Arial', [int]($Size * 0.45), [System.Drawing.FontStyle]::Bold)
  $brush = [System.Drawing.Brushes]::White
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 'Center'
  $sf.LineAlignment = 'Center'
  $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
  $g.DrawString('Z', $font, $brush, $rect, $sf)
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

$iconDir = Join-Path $PSScriptRoot "..\assets\icons"
New-Item -ItemType Directory -Force -Path $iconDir | Out-Null
Create-Icon -Size 192 -Path (Join-Path $iconDir "icon-192.png")
Create-Icon -Size 512 -Path (Join-Path $iconDir "icon-512.png")
Write-Host "Icons created successfully"
