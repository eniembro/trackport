import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SecurityService } from '../lib/securityService';
import { supabase } from '../lib/supabase';

interface PasswordRequirement {
  test: boolean;
  text: string;
}

interface PasswordResetScreenProps {
  onPasswordReset: (newPassword: string) => Promise<void>;
  onCancel: () => void;
}

export default function PasswordResetScreen({ onPasswordReset, onCancel }: PasswordResetScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([]);
  const [showRequirements, setShowRequirements] = useState(false);

  useEffect(() => {
    checkPasswordRequirements();
  }, [newPassword]);

  const checkPasswordRequirements = () => {
    const validation = SecurityService.validatePasswordStrength(newPassword);
    
    const requirements: PasswordRequirement[] = [
      {
        test: validation.requirements.minLength,
        text: 'Al menos 8 caracteres'
      },
      {
        test: validation.requirements.hasUppercase,
        text: 'Al menos una letra mayúscula'
      },
      {
        test: validation.requirements.hasLowercase,
        text: 'Al menos una letra minúscula'
      },
      {
        test: validation.requirements.hasNumbers,
        text: 'Al menos un número'
      },
      {
        test: validation.requirements.hasSpecialChars,
        text: 'Al menos un carácter especial (!@#$%^&*)'
      }
    ];

    setPasswordRequirements(requirements);
    setShowRequirements(newPassword.length > 0);
  };

  const validateForm = (): boolean => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña actual');
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Por favor ingresa una nueva contraseña');
      return false;
    }

    const validation = SecurityService.validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      Alert.alert(
        'Contraseña débil', 
        'La nueva contraseña no cumple con los requisitos mínimos de seguridad'
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || loading) return;

    try {
      setLoading(true);
      await onPasswordReset(newPassword);
      
      // Success handled by parent component
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo actualizar la contraseña. Por favor, inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSecurePassword = () => {
    const generatedPassword = SecurityService.generateSecurePassword(12);
    setNewPassword(generatedPassword);
    setConfirmPassword('');
    
    Alert.alert(
      'Contraseña generada',
      `Se ha generado una contraseña segura. Por favor cópiala y guárdala en un lugar seguro:\n\n${generatedPassword}`,
      [
        {
          text: 'Entendido',
          onPress: () => setConfirmPassword(generatedPassword)
        }
      ]
    );
  };

  const getPasswordStrengthColor = (): string => {
    const validation = SecurityService.validatePasswordStrength(newPassword);
    if (newPassword.length === 0) return '#ddd';
    if (validation.score <= 2) return '#e74c3c';
    if (validation.score <= 3) return '#f39c12';
    if (validation.score <= 4) return '#f1c40f';
    return '#27ae60';
  };

  const getPasswordStrengthText = (): string => {
    const validation = SecurityService.validatePasswordStrength(newPassword);
    if (newPassword.length === 0) return '';
    if (validation.score <= 2) return 'Débil';
    if (validation.score <= 3) return 'Regular';
    if (validation.score <= 4) return 'Buena';
    return 'Excelente';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🔐 Cambiar Contraseña</Text>
          <Text style={styles.subtitle}>
            Por seguridad, debes cambiar tu contraseña temporal antes de continuar
          </Text>
        </View>

        <View style={styles.form}>
          {/* Contraseña actual */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña Actual *</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Ingresa tu contraseña temporal"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Nueva contraseña */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Nueva Contraseña *</Text>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateSecurePassword}
              >
                <Text style={styles.generateButtonText}>🎲 Generar</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Crea una contraseña segura"
              secureTextEntry
              autoCapitalize="none"
            />
            
            {/* Indicador de fortaleza */}
            {newPassword.length > 0 && (
              <View style={styles.strengthIndicator}>
                <View 
                  style={[
                    styles.strengthBar,
                    { backgroundColor: getPasswordStrengthColor() }
                  ]} 
                />
                <Text style={[
                  styles.strengthText,
                  { color: getPasswordStrengthColor() }
                ]}>
                  {getPasswordStrengthText()}
                </Text>
              </View>
            )}
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Nueva Contraseña *</Text>
            <TextInput
              style={[
                styles.input,
                confirmPassword.length > 0 && confirmPassword !== newPassword && styles.inputError
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry
              autoCapitalize="none"
            />
            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
              <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
            )}
          </View>

          {/* Requisitos de contraseña */}
          {showRequirements && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Requisitos de seguridad:</Text>
              {passwordRequirements.map((req, index) => (
                <View key={index} style={styles.requirement}>
                  <Text style={[
                    styles.requirementIcon,
                    { color: req.test ? '#27ae60' : '#e74c3c' }
                  ]}>
                    {req.test ? '✓' : '✗'}
                  </Text>
                  <Text style={[
                    styles.requirementText,
                    { color: req.test ? '#27ae60' : '#666' }
                  ]}>
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Consejos de seguridad */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Consejos de seguridad:</Text>
            <Text style={styles.tipText}>• Usa una combinación única de letras, números y símbolos</Text>
            <Text style={styles.tipText}>• Evita información personal como nombres o fechas</Text>
            <Text style={styles.tipText}>• No reutilices contraseñas de otras cuentas</Text>
            <Text style={styles.tipText}>• Considera usar un gestor de contraseñas</Text>
          </View>

          {/* Botón de actualización */}
          <TouchableOpacity
            style={[
              styles.updateButton,
              loading && styles.updateButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>🔒 Actualizar Contraseña</Text>
            )}
          </TouchableOpacity>

          {/* Información adicional */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>ℹ️ Información importante:</Text>
            <Text style={styles.infoText}>
              • Esta es una contraseña temporal que debe ser cambiada por seguridad
            </Text>
            <Text style={styles.infoText}>
              • Una vez cambiada, podrás acceder normalmente al sistema
            </Text>
            <Text style={styles.infoText}>
              • Si tienes problemas, contacta al administrador del sistema
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  strengthIndicator: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  requirementsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    width: 16,
  },
  requirementText: {
    fontSize: 14,
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#1976d2',
    marginBottom: 4,
  },
  updateButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  updateButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 4,
  },
});