import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
          <View style={[styles.logoBackground, logoSize]}>
            {/* Contenedor principal */}
            <View style={styles.containerIcon}>
              <Ionicons name="cube-outline" size={logoSize.width * 0.3} color="#93c5fd" />
            </View>
            {/* Grúa portuaria */}
            <View style={styles.craneIcon}>
              <Ionicons name="construct-outline" size={logoSize.width * 0.2} color="#93c5fd" />
            </View>
          </View>
        </View>
      )}
      
      {showText && variant !== 'icon-only' && (
        <View style={styles.textContainer}>
          <Text style={[styles.logoText, { fontSize: textSize }]}>
            TrackPort
          </Text>
          <Text style={[styles.subtitle, { fontSize: textSize * 0.4 }]}>
            Container Tracking & Customs
          </Text>
        </View>
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
  logoBackground: {
    backgroundColor: '#1e3a8a',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    position: 'relative',
  },
  containerIcon: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -10 }],
  },
  craneIcon: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    transform: [{ translateX: -5 }, { translateY: -5 }],
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  logoText: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
    fontStyle: 'italic',
  },
});