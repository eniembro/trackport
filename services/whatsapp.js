// WhatsApp Notification System for TrackPort
// Integración completa para notificaciones de status de contenedores

class WhatsAppNotifier {
    constructor(config) {
        this.config = {
            // Configuración para Twilio WhatsApp API (Opción recomendada)
            provider: config.provider || 'twilio', // 'twilio' | 'meta' | 'baileys'
            
            // Credenciales Twilio
            twilioSid: config.twilioSid || process.env.TWILIO_ACCOUNT_SID,
            twilioToken: config.twilioToken || process.env.TWILIO_AUTH_TOKEN,
            twilioWhatsAppFrom: config.twilioWhatsAppFrom || 'whatsapp:+14155238886',
            
            // Credenciales Meta WhatsApp Business API
            metaToken: config.metaToken || process.env.WHATSAPP_ACCESS_TOKEN,
            metaPhoneId: config.metaPhoneId || process.env.WHATSAPP_PHONE_NUMBER_ID,
            
            // Configuración general
            companyName: 'TrackPort',
            supportPhone: '+52 33 1234 5678',
            websiteUrl: 'https://www.track-port.com'
        };
    }

    // Enviar notificación de cambio de status
    async sendStatusUpdate(containerData, clientPhone) {
        try {
            const message = this.formatStatusMessage(containerData);
            
            switch (this.config.provider) {
                case 'twilio':
                    return await this.sendViaTwilio(clientPhone, message);
                case 'meta':
                    return await this.sendViaMeta(clientPhone, message);
                default:
                    throw new Error(`Proveedor no soportado: ${this.config.provider}`);
            }
        } catch (error) {
            console.error('Error enviando WhatsApp:', error);
            throw error;
        }
    }

    // Twilio WhatsApp API
    async sendViaTwilio(to, message) {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${this.config.twilioSid}/Messages.json`;
        
        const body = new URLSearchParams({
            From: this.config.twilioWhatsAppFrom,
            To: `whatsapp:${to}`,
            Body: message
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(this.config.twilioSid + ':' + this.config.twilioToken),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`Twilio error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Meta WhatsApp Business API
    async sendViaMeta(to, message) {
        const url = `https://graph.facebook.com/v18.0/${this.config.metaPhoneId}/messages`;
        
        const payload = {
            messaging_product: "whatsapp",
            to: to,
            type: "text",
            text: { body: message }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.metaToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Meta WhatsApp error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Formatear mensaje de status
    formatStatusMessage(containerData) {
        const statusEmojis = {
            'en_origen': '📦',
            'documentos_recibidos': '📄',
            'en_transito_origen': '🚛',
            'llegada_puerto_origen': '🚢',
            'carga_buque': '⚓',
            'zarpe_origen': '🌊',
            'en_transito_maritimo': '🛳️',
            'llegada_puerto_destino': '🏙️',
            'descarga_buque': '🏗️',
            'revision_aduanal': '👮',
            'liberado_aduana': '✅',
            'en_transito_destino': '🚚',
            'entregado': '🎉'
        };

        const emoji = statusEmojis[containerData.status] || '📦';
        
        return `${emoji} *TrackPort - Actualización de Contenedor*

📦 *Contenedor:* ${containerData.number}
📍 *Status:* ${this.translateStatus(containerData.status)}
📅 *Fecha:* ${new Date().toLocaleDateString('es-MX')}
🕐 *Hora:* ${new Date().toLocaleTimeString('es-MX')}

${containerData.location ? `📌 *Ubicación:* ${containerData.location}` : ''}
${containerData.estimatedArrival ? `⏰ *ETA:* ${containerData.estimatedArrival}` : ''}

${this.getStatusDescription(containerData.status)}

---
🌐 Seguimiento completo: ${this.config.websiteUrl}
📞 Soporte: ${this.config.supportPhone}

*${this.config.companyName}* - Tu socio confiable en logística`;
    }

    // Traducir status a español legible
    translateStatus(status) {
        const translations = {
            'en_origen': 'En Origen',
            'documentos_recibidos': 'Documentos Recibidos',
            'en_transito_origen': 'En Tránsito desde Origen',
            'llegada_puerto_origen': 'Llegada a Puerto de Origen',
            'carga_buque': 'Cargando al Buque',
            'zarpe_origen': 'Zarpe desde Origen',
            'en_transito_maritimo': 'En Tránsito Marítimo',
            'llegada_puerto_destino': 'Llegada a Puerto Destino',
            'descarga_buque': 'Descargando del Buque',
            'revision_aduanal': 'En Revisión Aduanal',
            'liberado_aduana': 'Liberado por Aduana',
            'en_transito_destino': 'En Tránsito a Destino Final',
            'entregado': 'Entregado'
        };
        return translations[status] || status;
    }

    // Descripción detallada del status
    getStatusDescription(status) {
        const descriptions = {
            'en_origen': 'Tu contenedor está siendo preparado en origen.',
            'documentos_recibidos': 'Hemos recibido toda la documentación necesaria.',
            'en_transito_origen': 'El contenedor está en camino al puerto de origen.',
            'llegada_puerto_origen': 'El contenedor ha llegado al puerto de origen.',
            'carga_buque': 'Tu carga está siendo embarcada.',
            'zarpe_origen': 'El buque ha zarpado hacia destino.',
            'en_transito_maritimo': 'Tu contenedor está navegando hacia destino.',
            'llegada_puerto_destino': 'El buque ha llegado al puerto destino.',
            'descarga_buque': 'Tu contenedor está siendo descargado.',
            'revision_aduanal': 'El contenedor está en proceso aduanal.',
            'liberado_aduana': '¡Excelente! Tu carga ha sido liberada.',
            'en_transito_destino': 'El contenedor está en camino a su destino final.',
            'entregado': '¡Felicidades! Tu contenedor ha sido entregado.'
        };
        return descriptions[status] || 'Status actualizado.';
    }

    // Enviar recordatorio de pago
    async sendPaymentReminder(paymentData, clientPhone) {
        const message = `💳 *TrackPort - Recordatorio de Pago*

Hola, tienes un pago pendiente:

📦 *Contenedor:* ${paymentData.containerNumber}
💰 *Monto:* $${paymentData.amount} ${paymentData.currency}
📅 *Vencimiento:* ${paymentData.dueDate}
🏦 *Concepto:* ${paymentData.concept}

Por favor, realiza el pago a tiempo para evitar retrasos en tu envío.

💻 Pagar en línea: ${this.config.websiteUrl}/payments
📞 Dudas: ${this.config.supportPhone}

*${this.config.companyName}*`;

        return await this.sendStatusUpdate({ status: 'payment_reminder' }, clientPhone, message);
    }

    // Alerta de documento requerido
    async sendDocumentAlert(documentData, clientPhone) {
        const message = `📄 *TrackPort - Documento Requerido*

Se requiere documentación para tu contenedor:

📦 *Contenedor:* ${documentData.containerNumber}
📋 *Documento:* ${documentData.documentType}
⏰ *Fecha límite:* ${documentData.deadline}
⚠️ *Urgencia:* ${documentData.priority}

${documentData.description}

📤 Subir documento: ${this.config.websiteUrl}/documents
📞 Asistencia: ${this.config.supportPhone}

*${this.config.companyName}*`;

        return await this.sendStatusUpdate({ status: 'document_alert' }, clientPhone, message);
    }

    // Notificación de llegada
    async sendArrivalNotification(containerData, clientPhone) {
        const message = `🎉 *TrackPort - ¡Tu Contenedor Ha Llegado!*

📦 *Contenedor:* ${containerData.number}
📍 *Puerto destino:* ${containerData.arrivalPort}
📅 *Fecha de llegada:* ${containerData.arrivalDate}

🚨 *Próximos pasos:*
1. Revisión aduanal automática
2. Liberación de carga
3. Programación de entrega

Estaremos en contacto para coordinar la entrega final.

🌐 ${this.config.websiteUrl}
📞 ${this.config.supportPhone}

*${this.config.companyName}*`;

        return await this.sendStatusUpdate(containerData, clientPhone, message);
    }

    // Test de conectividad
    async testConnection() {
        try {
            const testMessage = `🧪 *TrackPort - Test de Conexión*

Este es un mensaje de prueba del sistema de notificaciones WhatsApp.

✅ Conexión exitosa
🕐 ${new Date().toLocaleString('es-MX')}

*Sistema funcionando correctamente*`;

            // Número de prueba (cambiar por número real)
            const testPhone = '+5233XXXXXXXX';
            
            return await this.sendStatusUpdate(
                { status: 'test', number: 'TEST-001' }, 
                testPhone, 
                testMessage
            );
        } catch (error) {
            console.error('Test de WhatsApp falló:', error);
            throw error;
        }
    }
}

// Exportar para uso
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppNotifier;
}

// Uso en browser (para TrackPort web)
if (typeof window !== 'undefined') {
    window.WhatsAppNotifier = WhatsAppNotifier;
}

/* 
CONFIGURACIÓN REQUERIDA:

1. Twilio (Recomendado):
   - Crear cuenta en https://www.twilio.com
   - Obtener Account SID y Auth Token
   - Activar WhatsApp Sandbox o aprobar número business

2. Meta WhatsApp Business API:
   - Configurar Meta Business Account
   - Crear WhatsApp Business App
   - Obtener Access Token y Phone Number ID

3. Variables de entorno:
   TWILIO_ACCOUNT_SID=ACxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxx
   WHATSAPP_ACCESS_TOKEN=xxxxxx
   WHATSAPP_PHONE_NUMBER_ID=xxxxxx

EJEMPLO DE USO:

const notifier = new WhatsAppNotifier({
    provider: 'twilio',
    twilioSid: 'ACxxxxxx',
    twilioToken: 'xxxxxx'
});

// Enviar actualización de status
await notifier.sendStatusUpdate({
    number: 'TPRT-2025-001',
    status: 'en_transito_maritimo',
    location: 'Océano Pacífico',
    estimatedArrival: '2025-01-15'
}, '+5233XXXXXXXX');

*/