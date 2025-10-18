import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_CONFIG } from '../utils/config';

interface FooterProps {
  variant?: 'minimal' | 'full';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'minimal' }) => {
  const openWebsite = () => {
    Linking.openURL(APP_CONFIG.company.website);
  };

  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${APP_CONFIG.contact.whatsapp.replace(/\D/g, '')}`;
    Linking.openURL(whatsappUrl);
  };

  const sendEmail = () => {
    Linking.openURL(`mailto:${APP_CONFIG.company.email}`);
  };

  if (variant === 'minimal') {
    return (
      <View style={styles.minimalContainer}>
        <Text style={styles.copyrightText}>
          © 2024 TrackPort - www.track-port.com
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contacto</Text>
        <TouchableOpacity style={styles.contactItem} onPress={sendEmail}>
          <Ionicons name="mail" size={16} color="#1e3a8a" />
          <Text style={styles.contactText}>{APP_CONFIG.company.email}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
          <Text style={styles.contactText}>{APP_CONFIG.contact.whatsapp}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
          <Ionicons name="globe" size={16} color="#1e3a8a" />
          <Text style={styles.contactText}>www.track-port.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.companyName}>TrackPort</Text>
        <Text style={styles.tagline}>{APP_CONFIG.app.tagline}</Text>
        <Text style={styles.address}>{APP_CONFIG.contact.address}</Text>
      </View>

      <View style={styles.copyrightSection}>
        <Text style={styles.copyrightText}>
          © 2024 TrackPort. Todos los derechos reservados.
        </Text>
        <Text style={styles.versionText}>Versión {APP_CONFIG.app.version}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  minimalContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  fullContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  contactSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  address: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  copyrightSection: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 15,
  },
  copyrightText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  versionText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});