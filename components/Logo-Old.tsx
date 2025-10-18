import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { SvgUri } from 'react-native-svg';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'full' | 'icon-only' | 'text-only';
}

// Professional TrackPort Logo Component - Blue Container Truck Design
export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  variant = 'full' 
}) => {
  const getLogoSize = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 50 };
      case 'medium':
        return { width: 120, height: 75 };
      case 'large':
        return { width: 180, height: 110 };
      default:
        return { width: 120, height: 75 };
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

  // Professional TrackPort Truck Logo
  const TruckLogo = () => (
    <View style={[styles.truckContainer, logoSize]}>
      {/* Truck Cab */}
      <View style={styles.truckCab}>
        <View style={styles.cabFront} />
        <View style={styles.cabWindows} />
      </View>
      
      {/* Container/Trailer */}
      <View style={styles.container}>
        <View style={styles.containerBody}>
          {/* Building/Port Icon on Container */}
          <View style={styles.portIcon}>
            <View style={styles.buildingBase} />
            <View style={styles.buildingTop} />
            <View style={styles.buildingColumns} />
          </View>
          
          {/* TrackPort Text on Container */}
          <Text style={styles.containerBrandText}>Track-Port.</Text>
        </View>
        
        {/* Container Details */}
        <View style={styles.containerRidges}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.ridge} />
          ))}
        </View>
      </View>
      
      {/* Wheels */}
      <View style={styles.wheelsContainer}>
        <View style={[styles.wheel, styles.frontWheel]} />
        <View style={[styles.wheel, styles.rearWheel1]} />
        <View style={[styles.wheel, styles.rearWheel2]} />
      </View>
    </View>
  );

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
      {(variant === 'full' || variant === 'icon-only') && <TruckLogo />}
      
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
  
  // Truck Container Styles
  truckContainer: {
    position: 'relative',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Truck Cab Styles
  truckCab: {
    position: 'absolute',
    left: 8,
    top: 12,
    width: 28,
    height: 35,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    borderTopLeftRadius: 8,
  },
  cabFront: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 4,
    height: 20,
    backgroundColor: '#1d4ed8',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  cabWindows: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 20,
    height: 12,
    backgroundColor: '#60a5fa',
    borderRadius: 2,
  },
  
  // Container/Trailer Styles
  container: {
    position: 'absolute',
    left: 32,
    top: 8,
    right: 8,
    height: 45,
    backgroundColor: '#1e40af',
    borderRadius: 4,
  },
  containerBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  
  // Port Icon on Container
  portIcon: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  buildingBase: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    width: 12,
    height: 8,
    backgroundColor: '#93c5fd',
    borderRadius: 1,
  },
  buildingTop: {
    position: 'absolute',
    bottom: 6,
    left: 4,
    width: 8,
    height: 6,
    backgroundColor: '#dbeafe',
    borderRadius: 1,
  },
  buildingColumns: {
    position: 'absolute',
    bottom: 2,
    left: 5,
    width: 6,
    height: 4,
    backgroundColor: '#60a5fa',
  },
  
  // Container Text
  containerBrandText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  // Container Ridges
  containerRidges: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ridge: {
    width: 1,
    height: 20,
    backgroundColor: '#1e3a8a',
    opacity: 0.6,
  },
  
  // Wheels
  wheelsContainer: {
    position: 'absolute',
    bottom: -3,
    left: 0,
    right: 0,
  },
  wheel: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#374151',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1f2937',
  },
  frontWheel: {
    left: 20,
    bottom: 0,
  },
  rearWheel1: {
    right: 20,
    bottom: 0,
  },
  rearWheel2: {
    right: 35,
    bottom: 0,
  },
  
  // Text Styles
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