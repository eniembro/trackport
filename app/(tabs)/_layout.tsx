import { Tabs, Redirect } from 'expo-router';
import { Text } from 'react-native';
import React from 'react';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user, loading, requiresPasswordReset } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Redirect to password reset if required
  if (requiresPasswordReset) {
    return <Redirect href="/password-reset" />;
  }

  const isClient = user.role === 'client';
  const isCustomerService = user.role === 'customer_service';
  const isCustomsBroker = user.role === 'customs_broker';
  const isSales = user.role === 'sales';
  const isMainAdmin = user.role === 'main_admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.secondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Text style={{fontSize: 20}}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="containers"
        options={{
          title: 'Contenedores',
          tabBarIcon: ({ color, size }) => <Text style={{fontSize: 20}}>📦</Text>,
          href: isClient || isCustomerService || isCustomsBroker || isMainAdmin ? '/(tabs)/containers' : null,
        }}
      />
      <Tabs.Screen
        name="instructions"
        options={{
          title: 'Instrucciones',
          tabBarIcon: ({ color, size }) => <Text style={{fontSize: 20}}>📋</Text>,
          href: isClient ? '/(tabs)/instructions' : null,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => <Text style={{fontSize: 20}}>⚙️</Text>,
          href: isMainAdmin ? '/(tabs)/admin' : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Text style={{fontSize: 20}}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
