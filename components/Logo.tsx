import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
        <View style={styles.brandText}>
          <Text style={[styles.trackText, { fontSize: textSize }]}>
            Track
          </Text>
          <Text style={[styles.portText, { fontSize: textSize }]}>
            Port
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(variant === 'full' || variant === 'icon-only') && (
        <View style={[styles.logoContainer, logoSize]}>
          {/* Professional TrackPort Logo with Truck Design */}
          <View style={[styles.logoBackground, logoSize]}>
            {/* Main truck icon representing the professional logo */}
            <View style={styles.truckContainer}>
              <Ionicons 
                name="car-outline" 
                size={logoSize.width * 0.4} 
                color="#60a5fa" 
                style={styles.truckIcon}
              />
              {/* Container/warehouse icon overlay */}
              <View style={styles.containerOverlay}>
                <Ionicons 
                  name="business-outline" 
                  size={logoSize.width * 0.15} 
                  color="#ffffff" 
                />
              </View>
            </View>
          </View>
        </View>
      )}
      
      {showText && variant !== 'icon-only' && (
        <View style={styles.textContainer}>
          <View style={styles.brandText}>
            <Text style={[styles.trackText, { fontSize: textSize }]}>
              Track
            </Text>
            <Text style={[styles.portText, { fontSize: textSize }]}>
              Port
            </Text>
          </View>
          <Text style={[styles.subtitle, { fontSize: textSize * 0.35 }]}>
            Container Tracking & Customs Management
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
    marginBottom: 12,
  },
  logoBackground: {
    backgroundColor: '#1e3a8a',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  truckContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  truckIcon: {
    transform: [{ scaleX: 1.2 }], // Make truck wider/more professional
  },
  containerOverlay: {
    position: 'absolute',
    top: '20%',
    right: '25%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  brandText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackText: {
    fontWeight: 'bold',
    color: '#1e3a8a', // Navy blue for "Track"
    letterSpacing: 1,
  },
  portText: {
    fontWeight: 'bold',
    color: '#60a5fa', // Light blue for "Port"
    letterSpacing: 1,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});