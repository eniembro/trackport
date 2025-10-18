#!/bin/bash

# TrackPort - Script de Deployment Web
# Para deployment en www.track-port.com

echo "🚀 TrackPort - Deployment Script"
echo "================================="

# 1. Verificar que no hay errores
echo "📋 Verificando errores de TypeScript..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ Error: Hay errores de TypeScript. Corrige antes de continuar."
    exit 1
fi

# 2. Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf dist/
rm -rf .expo/

# 3. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 4. Generar build web de producción
echo "🏗️ Generando build web de producción..."
npx expo export --platform web

# 5. Verificar que el build se generó
if [ ! -d "dist" ]; then
    echo "❌ Error: No se generó el build web"
    exit 1
fi

# 6. Verificar archivos críticos
echo "✅ Verificando archivos críticos..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: index.html no encontrado"
    exit 1
fi

if [ ! -f "dist/track-port.logo.svg" ]; then
    echo "❌ Error: Logo SVG no encontrado"
    exit 1
fi

# 7. Mostrar estadísticas del build
echo "📊 Estadísticas del build:"
echo "- Tamaño total: $(du -sh dist/ | cut -f1)"
echo "- Archivos generados: $(find dist/ -type f | wc -l | tr -d ' ')"
echo "- Logo SVG: $(ls -lh dist/track-port.logo.svg | awk '{print $5}')"

# 8. Crear servidor local para pruebas
echo "🌐 Iniciando servidor local para pruebas..."
echo "👉 Abre http://localhost:8080 para probar"
echo "👉 Presiona Ctrl+C para detener"

cd dist && python3 -m http.server 8080