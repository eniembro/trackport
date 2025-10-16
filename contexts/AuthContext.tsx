import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseClient } from '@/lib/supabase';
import { AdminService } from '../src/lib/adminService';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  requiresPasswordReset: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development/testing
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@trackport.com',
    name: 'Admin Usuario',
    role: 'main_admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'cliente@test.com',
    name: 'Cliente Test',
    role: 'client',
    clientId: 'client-001',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'sac@trackport.com',
    name: 'SAC Usuario',
    role: 'customer_service',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'agencia@test.com',
    name: 'Agencia Aduanal',
    role: 'customs_broker',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    email: 'ventas@trackport.com',
    name: 'Ventas Usuario',
    role: 'sales',
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [requiresPasswordReset, setRequiresPasswordReset] = useState(false);

  useEffect(() => {
    loadStoredUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      checkUserRole(user.id);
      checkPasswordResetRequired(user.id);
    }
  }, [user]);

  const checkUserRole = async (userId: string) => {
    try {
      const role = await AdminService.getUserRole(userId);
      setIsAdmin(role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
    }
  };

  const checkPasswordResetRequired = async (userId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('user_creation_log')
        .select('password_reset_required')
        .eq('created_user_id', userId)
        .single();

      if (!error && data) {
        setRequiresPasswordReset(data.password_reset_required);
      } else {
        setRequiresPasswordReset(false);
      }
    } catch (error) {
      console.error('Error checking password reset requirement:', error);
      setRequiresPasswordReset(false);
    }
  };

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For development, use mock authentication
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (mockUser && password === 'password') {
        await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }

      // Real Supabase authentication would go here
      // const { data, error } = await supabaseClient.auth.signInWithPassword({
      //   email,
      //   password,
      // });

      throw new Error('Credenciales inválidas');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
      
      // Real Supabase logout would go here
      // await supabaseClient.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      
      // Real Supabase registration would go here
      // const { data, error } = await supabaseClient.auth.signUp({
      //   email,
      //   password,
      // });

      throw new Error('Registro no implementado en modo desarrollo');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      setLoading(true);

      // Update password in Supabase auth
      const { error: authError } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      if (authError) {
        throw authError;
      }

      // Mark password reset as completed
      const { error: updateError } = await supabaseClient
        .from('user_creation_log')
        .update({ password_reset_required: false })
        .eq('created_user_id', user.id);

      if (updateError) {
        console.error('Error updating password reset status:', updateError);
      }

      setRequiresPasswordReset(false);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      requiresPasswordReset, 
      login, 
      logout, 
      register, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}