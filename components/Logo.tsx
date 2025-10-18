import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'full' | 'icon-only' | 'text-only';
}

// TrackPort Logo Component - Using Real SVG Logo from Desktop
export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  variant = 'full' 
}) => {
  const getLogoSize = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'medium':
        return { width: 120, height: 120 };
      case 'large':
        return { width: 180, height: 180 };
      default:
        return { width: 120, height: 120 };
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

  // Real TrackPort Logo Component
  const RealLogo = () => {
    if (Platform.OS === 'web') {
      // For web, try to use the SVG directly
      return (
        <View style={[styles.logoContainer, logoSize]}>
          <View style={[styles.svgContainer, logoSize]}>
            <iframe
              src="/assets/track-port.logo.svg"
              width={logoSize.width}
              height={logoSize.height}
              style={{ border: 'none' }}
              title="TrackPort Logo"
            />
          </View>
        </View>
      );
    } else {
      // For mobile, use a styled version that represents the logo
      return (
        <View style={[styles.logoContainer, logoSize]}>
          <View style={[styles.realLogoPlaceholder, logoSize]}>
            <Text style={[styles.logoMainText, { fontSize: logoSize.width * 0.2 }]}>
              TrackPort
            </Text>
            <Text style={styles.logoDescription}>Real SVG Logo</Text>
          </View>
        </View>
      );
    }
  };

  if (variant === 'text-only') {
    return (
      <View style={styles.textOnlyContainer}>
        <View style={styles.brandTextContainer}>
          <Text style={[styles.trackText, { fontSize: textSize }]}>Track</Text>
          <Text style={[styles.portText, { fontSize: textSize }]}>Port</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.logoWrapper}>
      {(variant === 'full' || variant === 'icon-only') && <RealLogo />}
      
      {showText && variant !== 'icon-only' && (
        <View style={styles.textContainer}>
          <View style={styles.brandTextContainer}>
            <Text style={[styles.trackText, { fontSize: textSize }]}>Track</Text>
            <Text style={[styles.portText, { fontSize: textSize }]}>Port</Text>
          </View>
          <Text style={[styles.subtitle, { fontSize: textSize * 0.35 }]}>
            Container Tracking & Customs
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOnlyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  svgContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  realLogoPlaceholder: {
    backgroundColor: '#f0f9ff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoMainText: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  logoDescription: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  brandTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackText: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    letterSpacing: 1,
  },
  portText: {
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
});