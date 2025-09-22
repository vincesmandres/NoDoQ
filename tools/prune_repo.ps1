# tools\prune_repo.ps1
$ErrorActionPreference = "Stop"

# 1) mover web-client -> app (si existiera)
if (Test-Path "web-client") {
  git mv web-client app
}

# 2) eliminar backend si existe (MVP web3-first)
if (Test-Path "backend") {
  git rm -r --cached backend 2>$null
  Remove-Item -Recurse -Force backend
}

# 3) crear carpetas mínimas
New-Item -ItemType Directory -Force -Path zk\circuits | Out-Null
New-Item -ItemType Directory -Force -Path zk\build    | Out-Null
New-Item -ItemType Directory -Force -Path zk\scripts  | Out-Null
New-Item -ItemType Directory -Force -Path contracts\src | Out-Null
New-Item -ItemType Directory -Force -Path app\src\lib | Out-Null

# 4) .gitkeep para asegurar estructura
New-Item -ItemType File -Force -Path zk\circuits\.gitkeep | Out-Null
New-Item -ItemType File -Force -Path zk\build\.gitkeep    | Out-Null
New-Item -ItemType File -Force -Path zk\scripts\.gitkeep  | Out-Null
New-Item -ItemType File -Force -Path contracts\src\.gitkeep | Out-Null
New-Item -ItemType File -Force -Path app\src\lib\.gitkeep | Out-Null

# 5) Resumen final con conteo de archivos
$fileCount = (Get-ChildItem -Recurse -File | Measure-Object).Count
$dirCount = (Get-ChildItem -Recurse -Directory | Measure-Object).Count

Write-Host "✅ Poda y estructura listas."
Write-Host "📊 Resumen:"
Write-Host "   - Archivos totales: $fileCount"
Write-Host "   - Directorios totales: $dirCount"
