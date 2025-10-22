#!/bin/bash

# 📧 PASO 2: EMAILS LISTOS PARA ENVÍO

echo "📧 PASO 2: PREPARANDO EMAILS PARA ENVÍO"
echo "======================================"

echo ""
echo "📋 RESUMEN DE USUARIOS:"
echo "1. lrazo@track-port.com (Administrador)"
echo "2. fanny@track-port.com (Administrador)"
echo "3. admin@track-port.com (Webmaster)"
echo "4. ventas1@track-port.com (Ventas)"
echo "5. ventas2@track-port.com (Ventas)"
echo "6. sac1@track-port.com (SAC)"
echo "7. sac2@track-port.com (SAC)"
echo "8. aduana_lzo@track-port.com (Aduanal)"

echo ""
echo "📧 EMAILS PERSONALIZADOS DISPONIBLES:"
echo ""

# Función para mostrar información de cada email
show_email_info() {
    local file=$1
    local user=$2
    local role=$3
    
    if [ -f "emails/$file" ]; then
        local lines=$(wc -l < "emails/$file")
        local size=$(ls -lh "emails/$file" | awk '{print $5}')
        echo "✅ $file"
        echo "   Usuario: $user"
        echo "   Rol: $role"
        echo "   Contenido: $lines líneas, $size"
        echo ""
    else
        echo "❌ $file (no encontrado)"
    fi
}

show_email_info "email-lrazo.txt" "Luis Razo" "Administrador"
show_email_info "email-fanny.txt" "Fanny" "Administrador"
show_email_info "email-admin.txt" "Admin Principal" "Webmaster"
show_email_info "email-ventas1.txt" "Ventas 1" "Ejecutivo Ventas"
show_email_info "email-ventas2.txt" "Ventas 2" "Ejecutivo Ventas"
show_email_info "email-sac1.txt" "SAC 1" "Atención Cliente"
show_email_info "email-sac2.txt" "SAC 2" "Atención Cliente"
show_email_info "email-aduana.txt" "Aduana LZO" "Agente Aduanal"

echo ""
echo "🔍 PARA VER CONTENIDO DE UN EMAIL:"
echo "cat emails/email-lrazo.txt    # Ver email de Luis"
echo "cat emails/email-fanny.txt    # Ver email de Fanny"
echo "cat emails/email-admin.txt    # Ver email de Admin"
echo "# ... etc"

echo ""
echo "📤 INSTRUCCIONES DE ENVÍO:"
echo "1. Copiar contenido completo de cada archivo"
echo "2. Pegar en tu cliente de email"
echo "3. El asunto está incluido en la primera línea"
echo "4. Enviar a la dirección correspondiente"

echo ""
echo "✅ TODOS LOS EMAILS ESTÁN LISTOS PARA COPIAR/PEGAR"