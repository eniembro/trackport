#!/bin/bash

# 🚀 TrackPort - Script de Configuración GitHub Automática

echo "🔧 Configurando TrackPort en GitHub..."

# Verificar si existe el repositorio remoto
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "❌ No hay repositorio remoto configurado"
    echo ""
    echo "📋 Pasos para configurar GitHub:"
    echo ""
    echo "1. 🌐 Crear repositorio en GitHub:"
    echo "   - Ve a: https://github.com/new"
    echo "   - Repository name: trackport"
    echo "   - Description: TrackPort - Container Tracking & Customs Management App"
    echo "   - Visibility: Private (recomendado)"
    echo "   - NO marques 'Add README file'"
    echo "   - NO marques 'Add .gitignore'"
    echo ""
    echo "2. 🔗 Conectar repositorio local:"
    echo "   git remote add origin https://github.com/eniembro/trackport.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "3. ✅ Verificar subida exitosa:"
    echo "   git status"
    echo ""
else
    echo "✅ Repositorio remoto ya configurado:"
    git remote -v
    echo ""
    echo "📤 Sincronizando cambios..."
    git push
fi

echo "📊 Estado actual del repositorio:"
git status --porcelain
if [ $? -eq 0 ]; then
    echo "✅ Repositorio Git está limpio"
else
    echo "⚠️  Hay cambios pendientes"
fi

echo ""
echo "📁 Archivos en el repositorio:"
git ls-files | wc -l | xargs echo "Total de archivos tracked:"

echo ""
echo "🏷️  Último commit:"
git log --oneline -1