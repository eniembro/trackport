#!/bin/bash

# 🚀 Script para Preparar Release de TrackPort en GitHub
# Este script prepara todos los archivos para subir a GitHub

echo "🚢 TrackPort - Preparando Release para GitHub..."
echo "================================================"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "main.js" ]; then
    echo "❌ Error: No estamos en el directorio correcto de TrackPort"
    echo "   Por favor ejecuta desde: /Users/eniembro/trackport/"
    exit 1
fi

# Verificar que existe el archivo DMG
DMG_FILE="electron-dist/TrackPort-1.0.0-arm64.dmg"
if [ ! -f "$DMG_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo DMG: $DMG_FILE"
    echo "   Ejecuta primero: npm run package:mac"
    exit 1
fi

echo "✅ Archivo DMG encontrado: $(du -h $DMG_FILE | cut -f1)"

# Mostrar información del release
echo ""
echo "📋 Información del Release:"
echo "   • Tag: v1.0.0"
echo "   • Título: TrackPort v1.0.0 - Desktop Release 🚀"
echo "   • Archivo DMG: $DMG_FILE ($(du -h $DMG_FILE | cut -f1))"
echo "   • Commit actual: $(git rev-parse --short HEAD)"

# Verificar estado de Git
echo ""
echo "🔍 Verificando estado de Git..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Advertencia: Hay cambios sin commitear"
    echo "   Archivos modificados:"
    git status --porcelain
    echo ""
    echo "   ¿Deseas continuar? Los cambios sin commitear no se incluirán en el release."
    read -p "   Continuar (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelado por el usuario"
        exit 1
    fi
fi

# Verificar que existe el tag
if ! git tag -l | grep -q "v1.0.0"; then
    echo "❌ Error: El tag v1.0.0 no existe"
    echo "   Creando tag..."
    git tag -a v1.0.0 -m "TrackPort v1.0.0 - Desktop Release with macOS DMG"
    echo "✅ Tag v1.0.0 creado"
fi

# Mostrar instrucciones finales
echo ""
echo "🎯 PASOS PARA COMPLETAR EL RELEASE:"
echo "=================================="
echo ""
echo "1. 🔥 Crear repositorio en GitHub:"
echo "   • Ve a: https://github.com/new"
echo "   • Repository name: trackport"
echo "   • Description: 🚢 Container Tracking & Customs Management App"
echo "   • Visibility: Public"
echo "   • NO inicializar con README/gitignore"
echo ""
echo "2. 📤 Subir código:"
echo "   git push -u origin main"
echo "   git push origin v1.0.0"
echo ""
echo "3. 🎉 Crear Release:"
echo "   • Ve a: https://github.com/eniembro/trackport/releases/new"
echo "   • Tag: v1.0.0"
echo "   • Title: TrackPort v1.0.0 - Desktop Release 🚀"
echo "   • Sube el archivo: $DMG_FILE"
echo "   • Copia la descripción desde: GITHUB_RELEASE_INSTRUCTIONS.md"
echo ""
echo "4. ✅ Resultado:"
echo "   • URL del release: https://github.com/eniembro/trackport/releases/tag/v1.0.0"
echo "   • URL del DMG: https://github.com/eniembro/trackport/releases/download/v1.0.0/TrackPort-1.0.0-arm64.dmg"
echo ""
echo "🚀 ¡TrackPort estará listo para distribución pública!"
echo ""