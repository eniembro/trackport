import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export class SecurityService {
  /**
   * Almacenar de forma segura un elemento
   */
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw error;
    }
  }

  /**
   * Obtener de forma segura un elemento
   */
  static async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting secure item:', error);
      return null;
    }
  }

  /**
   * Eliminar de forma segura un elemento
   */
  static async deleteSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error deleting secure item:', error);
      throw error;
    }
  }

  /**
   * Generar hash de string usando SHA-256
   */
  static async hashString(input: string): Promise<string> {
    try {
      return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        input,
        { encoding: Crypto.CryptoEncoding.HEX }
      );
    } catch (error) {
      console.error('Error hashing string:', error);
      throw error;
    }
  }

  /**
   * Validar fuerza de contraseña
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    requirements: {
      minLength: boolean;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasNumbers: boolean;
      hasSpecialChars: boolean;
    };
  } {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const isValid = score >= 4 && requirements.minLength;

    return {
      isValid,
      score,
      requirements
    };
  }

  /**
   * Generar contraseña segura
   */
  static generateSecurePassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Asegurar al menos un carácter de cada tipo
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Llenar el resto aleatoriamente
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Mezclar los caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Encriptar datos sensibles
   */
  static async encryptData(data: string, key?: string): Promise<string> {
    try {
      const encryptionKey = key || await this.getOrCreateEncryptionKey();
      // Implementación básica de encriptación
      // En producción, usar una librería de encriptación más robusta
      const encoded = btoa(data + encryptionKey);
      return encoded;
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw error;
    }
  }

  /**
   * Desencriptar datos sensibles
   */
  static async decryptData(encryptedData: string, key?: string): Promise<string> {
    try {
      const encryptionKey = key || await this.getOrCreateEncryptionKey();
      // Implementación básica de desencriptación
      const decoded = atob(encryptedData);
      return decoded.replace(encryptionKey, '');
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw error;
    }
  }

  /**
   * Obtener o crear clave de encriptación
   */
  private static async getOrCreateEncryptionKey(): Promise<string> {
    const keyName = 'app_encryption_key';
    let key = await this.getSecureItem(keyName);
    
    if (!key) {
      key = this.generateSecurePassword(32);
      await this.setSecureItem(keyName, key);
    }
    
    return key;
  }

  /**
   * Validar entrada para prevenir inyecciones
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remover tags HTML básicos
      .replace(/['"]/g, '') // Remover comillas
      .trim();
  }

  /**
   * Generar token único
   */
  static generateUniqueToken(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}