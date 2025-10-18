import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'full' | 'icon-only' | 'text-only';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  variant = 'full' 
}) => {
  const getLogoSize = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60 };
      case 'medium':
        return { width: 100, height: 100 };
      case 'large':
        return { width: 150, height: 150 };
      default:
        return { width: 100, height: 100 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const logoSize = getLogoSize();
  const textSize = getTextSize();

  if (variant === 'text-only') {
    return (
      <View style={styles.container}>
        <Text style={[styles.logoText, { fontSize: textSize }]}>
          TrackPort
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(variant === 'full' || variant === 'icon-only') && (
        <View style={[styles.logoContainer, logoSize]}>
          {/* Placeholder para el logo - aquí irá la imagen real */}
          <View style={[styles.logoPlaceholder, logoSize]}>
            <Text style={styles.logoIcon}>🏗️</Text>
            <Text style={styles.logoIcon}>📦</Text>
          </View>
        </View>
      )}
      
      {showText && variant !== 'icon-only' && (
        <Text style={[styles.logoText, { fontSize: textSize }]}>
          TrackPort
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoPlaceholder: {
    backgroundColor: '#1e3a8a',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoIcon: {
    fontSize: 24,
    color: '#93c5fd',
  },
  logoText: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
  },
});