import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import PasswordResetScreen from '@/src/components/PasswordResetScreen';

export default function PasswordResetPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const handlePasswordReset = async (newPassword: string) => {
    try {
      await resetPassword(newPassword);
      router.replace('/(tabs)');
    } catch (error) {
      throw error; // Let PasswordResetScreen handle the error
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <PasswordResetScreen
        onPasswordReset={handlePasswordReset}
        onCancel={handleCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});