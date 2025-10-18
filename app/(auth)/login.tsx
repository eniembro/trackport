import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: string) => {
    const credentials: { [key: string]: { email: string; password: string } } = {
      admin: { email: 'admin@track-port.com', password: '123456' },
      client: { email: 'cliente@track-port.com', password: '123456' },
      service: { email: 'servicio@track-port.com', password: '123456' },
      customs: { email: 'agente@track-port.com', password: '123456' },
      sales: { email: 'ventas@track-port.com', password: '123456' },
    };
    
    const cred = credentials[role];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Logo size="large" showText={true} variant="full" />
          <Text style={styles.subtitle}>Sistema de Gestión de Contenedores</Text>
          <Text style={styles.websiteText}>www.track-port.com</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Usuarios Demo:</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => fillDemoCredentials('admin')}
            >
              <Text style={styles.demoButtonText}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => fillDemoCredentials('client')}
            >
              <Text style={styles.demoButtonText}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => fillDemoCredentials('service')}
            >
              <Text style={styles.demoButtonText}>Servicio</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => fillDemoCredentials('customs')}
            >
              <Text style={styles.demoButtonText}>Agente</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => fillDemoCredentials('sales')}
            >
              <Text style={styles.demoButtonText}>Ventas</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.demoNote}>Contraseña para todos: 123456</Text>
        </View>

        <Footer variant="minimal" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  websiteText: {
    fontSize: 14,
    color: '#1e3a8a',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e3a8a',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  demoButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '500',
  },
  demoNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});