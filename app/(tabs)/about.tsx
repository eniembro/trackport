import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Footer } from '../../components/Footer';
import { Logo } from '../../components/Logo';
import { APP_CONFIG } from '../../utils/config';

export default function About() {
  const { user } = useAuth();

  const openWebsite = () => {
    Linking.openURL(APP_CONFIG.company.website);
  };

  const sendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${APP_CONFIG.contact.whatsapp.replace(/\D/g, '')}`;
    Linking.openURL(whatsappUrl);
  };

  const getContactEmail = () => {
    switch (user?.role) {
      case 'client':
        return APP_CONFIG.company.supportEmail;
      case 'sales':
        return APP_CONFIG.company.salesEmail;
      case 'customs_broker':
        return APP_CONFIG.company.customsEmail;
      default:
        return APP_CONFIG.company.email;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Logo size="large" showText={false} variant="icon-only" />
        <Text style={styles.title}>TrackPort</Text>
        <Text style={styles.subtitle}>{APP_CONFIG.app.tagline}</Text>
        <Text style={styles.websiteHeader}>www.track-port.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nuestra Empresa</Text>
        <Text style={styles.description}>
          TrackPort es una plataforma integral de gestión de contenedores y trámites aduanales 
          que facilita el seguimiento completo de tus mercancías desde la llegada hasta la 
          liberación final.
        </Text>
        <Text style={styles.description}>
          Ofrecemos servicios especializados de asesoría aduanal, gestión documental y 
          coordinación logística para garantizar que tus operaciones de comercio exterior 
          se realicen de manera eficiente y segura.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servicios</Text>
        <View style={styles.servicesList}>
          <View style={styles.serviceItem}>
            <Ionicons name="cube" size={24} color="#1e3a8a" />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Gestión de Contenedores</Text>
              <Text style={styles.serviceDescription}>
                Seguimiento completo de 15 etapas del proceso aduanal
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <Ionicons name="document-text" size={24} color="#1e3a8a" />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Cartas de Instrucción</Text>
              <Text style={styles.serviceDescription}>
                Gestión digital de documentación y trámites
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <Ionicons name="shield-checkmark" size={24} color="#1e3a8a" />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Agencia Aduanal</Text>
              <Text style={styles.serviceDescription}>
                Servicios especializados de despacho aduanal
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <Ionicons name="card" size={24} color="#1e3a8a" />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Gestión de Pagos</Text>
              <Text style={styles.serviceDescription}>
                Control y seguimiento de todos los pagos del proceso
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactButton} onPress={openWebsite}>
            <Ionicons name="globe" size={20} color="#1e3a8a" />
            <Text style={styles.contactButtonText}>Visitar Sitio Web</Text>
            <Text style={styles.contactDetail}>www.track-port.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={() => sendEmail(getContactEmail())}
          >
            <Ionicons name="mail" size={20} color="#1e3a8a" />
            <Text style={styles.contactButtonText}>Enviar Email</Text>
            <Text style={styles.contactDetail}>{getContactEmail()}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={openWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.contactButtonText}>WhatsApp</Text>
            <Text style={styles.contactDetail}>{APP_CONFIG.contact.whatsapp}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Sistema</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Versión</Text>
            <Text style={styles.infoValue}>{APP_CONFIG.app.version}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Usuario</Text>
            <Text style={styles.infoValue}>{user?.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>
              {APP_CONFIG.roles[user?.role as keyof typeof APP_CONFIG.roles]?.name || user?.role}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <Footer variant="full" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  websiteHeader: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  servicesList: {
    marginTop: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactContainer: {
    marginTop: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  contactDetail: {
    fontSize: 14,
    color: '#666',
  },
  infoGrid: {
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
});