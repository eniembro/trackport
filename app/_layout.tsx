import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen 
          name="password-reset" 
          options={{ 
            headerShown: true,
            title: 'Cambiar Contraseña',
            presentation: 'modal'
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}
