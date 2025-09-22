#!/bin/bash

echo "🚀 Iniciando demo local de ZKMonk..."

echo "📦 Compilando circuitos ZK..."
if ! pnpm zk:compile; then
    echo "❌ Error al compilar circuitos ZK"
    exit 1
fi
echo "✅ Circuitos compilados."

echo "🏗️ Construyendo contratos..."
if ! pnpm contracts:build; then
    echo "❌ Error al construir contratos"
    exit 1
fi
echo "✅ Contratos construidos."

echo "🌐 Iniciando aplicación web..."
pnpm app:dev &
APP_PID=$!

sleep 5  # Esperar a que el servidor inicie

echo "🔗 Abriendo navegador en http://localhost:3000/vote"
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:3000/vote"
elif command -v open > /dev/null; then
    open "http://localhost:3000/vote"
else
    echo "⚠️ No se pudo abrir el navegador automáticamente. Visita http://localhost:3000/vote manualmente."
fi

echo "🎉 Demo local listo. Presiona Ctrl+C para detener."

# Esperar al proceso de la app
wait $APP_PID