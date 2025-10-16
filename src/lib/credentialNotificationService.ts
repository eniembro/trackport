import { Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

export interface CredentialNotificationPayload {
  username: string;
  email: string;
  temporaryPassword: string;
  module: string;
  role: string;
  department?: string;
  appName: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  isHTML: boolean;
}

export class CredentialNotificationService {
  private static readonly COMPANY_NAME = 'TrackPort';
  private static readonly SUPPORT_EMAIL = 'soporte@trackport.com';
  private static readonly SUPPORT_PHONE = '+52 1 33 1234 5678';

  /**
   * Enviar credenciales por email usando cliente de correo del dispositivo
   */
  static async sendCredentialsByEmail(
    email: string, 
    payload: CredentialNotificationPayload
  ): Promise<{ success: boolean; message: string }> {
    try {
      const template = this.generateEmailTemplate(payload);
      
      const isAvailable = await MailComposer.isAvailableAsync();
      
      if (!isAvailable) {
        return {
          success: false,
          message: 'No hay cliente de correo configurado en el dispositivo'
        };
      }

      const result = await MailComposer.composeAsync({
        recipients: [email],
        subject: template.subject,
        body: template.body,
        isHtml: template.isHTML
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        return {
          success: true,
          message: 'Credenciales enviadas por email exitosamente'
        };
      } else if (result.status === MailComposer.MailComposerStatus.SAVED) {
        return {
          success: true,
          message: 'Email guardado en borradores'
        };
      } else {
        return {
          success: false,
          message: 'Envío de email cancelado'
        };
      }
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: 'Error al enviar email: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }

  /**
   * Enviar credenciales por WhatsApp
   */
  static async sendCredentialsByWhatsApp(
    phoneNumber: string, 
    payload: CredentialNotificationPayload
  ): Promise<{ success: boolean; message: string }> {
    try {
      const message = this.generateWhatsAppMessage(payload);
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
      
      // Verificar si WhatsApp está disponible
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (!canOpen) {
        return {
          success: false,
          message: 'WhatsApp no está instalado en el dispositivo'
        };
      }

      await Linking.openURL(whatsappUrl);
      
      return {
        success: true,
        message: 'WhatsApp abierto con el mensaje de credenciales'
      };
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      return {
        success: false,
        message: 'Error al abrir WhatsApp: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }

  /**
   * Enviar notificación por SMS (usando cliente SMS del dispositivo)
   */
  static async sendCredentialsBySMS(
    phoneNumber: string, 
    payload: CredentialNotificationPayload
  ): Promise<{ success: boolean; message: string }> {
    try {
      const message = this.generateSMSMessage(payload);
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`;
      
      const canOpen = await Linking.canOpenURL(smsUrl);
      
      if (!canOpen) {
        return {
          success: false,
          message: 'No se puede abrir la aplicación de SMS'
        };
      }

      await Linking.openURL(smsUrl);
      
      return {
        success: true,
        message: 'Aplicación de SMS abierta con el mensaje de credenciales'
      };
    } catch (error) {
      console.error('Error opening SMS:', error);
      return {
        success: false,
        message: 'Error al abrir SMS: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }

  /**
   * Generar template de email para credenciales
   */
  private static generateEmailTemplate(payload: CredentialNotificationPayload): EmailTemplate {
    const subject = `🔑 Credenciales de acceso - ${this.COMPANY_NAME} | Módulo ${payload.module}`;
    
    const body = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .credentials-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
            .credential-item { margin: 10px 0; padding: 10px; background: #f0f2f5; border-radius: 5px; }
            .password { font-family: monospace; font-size: 18px; font-weight: bold; color: #e74c3c; background: #fff3cd; padding: 5px 10px; border-radius: 3px; }
            .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 ${this.COMPANY_NAME}</h1>
            <p>Credenciales de Acceso</p>
          </div>
          
          <div class="content">
            <h2>¡Bienvenido ${payload.username}!</h2>
            
            <p>Se ha creado tu cuenta en <strong>${this.COMPANY_NAME}</strong> para acceder al módulo de <strong>${payload.module}</strong>.</p>
            
            <div class="credentials-box">
              <h3>📋 Información de tu cuenta:</h3>
              
              <div class="credential-item">
                <strong>👤 Usuario:</strong> ${payload.email}
              </div>
              
              <div class="credential-item">
                <strong>🔑 Contraseña temporal:</strong>
                <div class="password">${payload.temporaryPassword}</div>
              </div>
              
              <div class="credential-item">
                <strong>🏢 Módulo:</strong> ${payload.module}
              </div>
              
              <div class="credential-item">
                <strong>👨‍💼 Rol:</strong> ${payload.role}
              </div>
              
              ${payload.department ? `
                <div class="credential-item">
                  <strong>🏛️ Departamento:</strong> ${payload.department}
                </div>
              ` : ''}
            </div>
            
            <div class="warning">
              <h4>⚠️ Importante - Seguridad:</h4>
              <ul>
                <li><strong>Cambia tu contraseña</strong> inmediatamente después del primer inicio de sesión</li>
                <li><strong>No compartas</strong> estas credenciales con nadie</li>
                <li><strong>Guarda</strong> esta información en un lugar seguro</li>
                <li>La contraseña temporal <strong>expirará en 48 horas</strong></li>
              </ul>
            </div>
            
            <h3>📱 Cómo acceder:</h3>
            <ol>
              <li>Abre la aplicación ${payload.appName}</li>
              <li>Ingresa tu email y contraseña temporal</li>
              <li>El sistema te pedirá crear una nueva contraseña</li>
              <li>¡Listo! Ya puedes usar el sistema</li>
            </ol>
          </div>
          
          <div class="footer">
            <p><strong>Soporte Técnico</strong></p>
            <p>📧 ${this.SUPPORT_EMAIL}</p>
            <p>📞 ${this.SUPPORT_PHONE}</p>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
              ${this.COMPANY_NAME} © ${new Date().getFullYear()} - Sistema de Gestión Empresarial
            </p>
          </div>
        </body>
      </html>
    `;

    return {
      subject,
      body,
      isHTML: true
    };
  }

  /**
   * Generar mensaje de WhatsApp para credenciales
   */
  private static generateWhatsAppMessage(payload: CredentialNotificationPayload): string {
    return `🔐 *${this.COMPANY_NAME}* - Credenciales de Acceso

¡Hola ${payload.username}! 👋

Se ha creado tu cuenta para acceder al módulo de *${payload.module}*.

📋 *Información de tu cuenta:*
👤 Usuario: ${payload.email}
🔑 Contraseña temporal: \`${payload.temporaryPassword}\`
🏢 Módulo: ${payload.module}
👨‍💼 Rol: ${payload.role}${payload.department ? `\n🏛️ Departamento: ${payload.department}` : ''}

⚠️ *IMPORTANTE:*
• Cambia tu contraseña después del primer login
• No compartas estas credenciales
• La contraseña expira en 48 horas

📱 *Cómo acceder:*
1. Abre la app ${payload.appName}
2. Ingresa email y contraseña temporal
3. Crea tu nueva contraseña
4. ¡Listo para usar!

🆘 *Soporte:* ${this.SUPPORT_PHONE}

---
${this.COMPANY_NAME} © ${new Date().getFullYear()}`;
  }

  /**
   * Generar mensaje SMS para credenciales
   */
  private static generateSMSMessage(payload: CredentialNotificationPayload): string {
    return `${this.COMPANY_NAME} - Credenciales

Hola ${payload.username}!

Tu cuenta para ${payload.module}:
Usuario: ${payload.email}
Contraseña: ${payload.temporaryPassword}
Rol: ${payload.role}

IMPORTANTE: Cambia la contraseña en el primer login. Expira en 48h.

Soporte: ${this.SUPPORT_PHONE}`;
  }

  /**
   * Formatear número de teléfono para WhatsApp/SMS
   */
  private static formatPhoneNumber(phone: string): string {
    // Eliminar espacios, guiones y paréntesis
    let formatted = phone.replace(/[\s\-\(\)]/g, '');
    
    // Si no empieza con +, agregar código de país de México
    if (!formatted.startsWith('+')) {
      if (formatted.startsWith('52')) {
        formatted = '+' + formatted;
      } else {
        formatted = '+52' + formatted;
      }
    }
    
    return formatted;
  }

  /**
   * Validar si un email es válido
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar si un número de teléfono es válido
   */
  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  }

  /**
   * Obtener métodos de notificación disponibles en el dispositivo
   */
  static async getAvailableNotificationMethods(): Promise<{
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  }> {
    try {
      const [emailAvailable, whatsappAvailable, smsAvailable] = await Promise.all([
        MailComposer.isAvailableAsync(),
        Linking.canOpenURL('whatsapp://'),
        Linking.canOpenURL('sms:')
      ]);

      return {
        email: emailAvailable,
        whatsapp: whatsappAvailable,
        sms: smsAvailable
      };
    } catch (error) {
      console.error('Error checking notification methods:', error);
      return {
        email: false,
        whatsapp: false,
        sms: false
      };
    }
  }
}