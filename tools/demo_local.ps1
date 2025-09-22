# tools/demo_local.ps1
$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando demo local de ZKMonk..."

try {
    Write-Host "📦 Compilando circuitos ZK..."
    pnpm zk:compile
    if ($LASTEXITCODE -ne 0) {
        throw "Error al compilar circuitos ZK"
    }
    Write-Host "✅ Circuitos compilados."

    Write-Host "🏗️ Construyendo contratos..."
    pnpm contracts:build
    if ($LASTEXITCODE -ne 0) {
        throw "Error al construir contratos"
    }
    Write-Host "✅ Contratos construidos."

    Write-Host "🌐 Iniciando aplicación web..."
    Start-Job -ScriptBlock { pnpm app:dev } | Out-Null

    Start-Sleep -Seconds 5  # Esperar a que el servidor inicie

    Write-Host "🔗 Abriendo navegador en http://localhost:3000/vote"
    Start-Process "http://localhost:3000/vote"

    Write-Host "🎉 Demo local listo. Presiona Ctrl+C para detener."

} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    exit 1
}