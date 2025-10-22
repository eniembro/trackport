import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { supabase, auth } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  supabaseUser: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Storage helper for web compatibility
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Ignore errors
    }
  },
  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      // Verificar sesión existente
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setSupabaseUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        // Fallback a autenticación local para desarrollo
        await checkStoredAuth();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await checkStoredAuth();
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      const userProfile: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        phone: data.phone,
        company: data.company,
        isActive: data.status === 'active',
        createdAt: data.created_at,
      };

      setUser(userProfile);
      
      // Guardar en storage apropiado según la plataforma
      if (typeof window !== 'undefined') {
        localStorage.setItem('@trackport_user', JSON.stringify(userProfile));
      } else {
        await AsyncStorage.setItem('@trackport_user', JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const checkStoredAuth = async () => {
    try {
      let storedUser;
      if (typeof window !== 'undefined') {
        storedUser = localStorage.getItem('@trackport_user');
      } else {
        storedUser = await AsyncStorage.getItem('@trackport_user');
      }
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    console.log('Starting login process for:', email);
    
    try {
      // Intentar login con Supabase
      console.log('Attempting Supabase authentication...');
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        console.log('Supabase login failed:', error.message);
        throw new Error(`Error de autenticación: ${error.message}`);
      } else if (data.user) {
        console.log('Supabase login successful, user ID:', data.user.id);
        setSupabaseUser(data.user);
        
        try {
          await loadUserProfile(data.user.id);
          console.log('User profile loaded successfully');
        } catch (profileError) {
          console.error('Failed to load user profile:', profileError);
          // Si falla cargar el perfil, usar datos básicos del auth
          const basicUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'Usuario',
            role: 'client',
            phone: '',
            isActive: true,
            createdAt: new Date().toISOString(),
          };
          setUser(basicUser);
          
          // Guardar en storage local para web
          if (typeof window !== 'undefined') {
            localStorage.setItem('@trackport_user', JSON.stringify(basicUser));
          } else {
            await AsyncStorage.setItem('@trackport_user', JSON.stringify(basicUser));
          }
          console.log('Using basic user profile as fallback');
        }
      } else {
        console.log('No user data returned from Supabase');
        throw new Error('Error al iniciar sesión - sin datos de usuario');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
      console.log('Login process completed');
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password, {
        name: userData.name,
        role: userData.role || 'client',
        phone: userData.phone,
        company: userData.company,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        setSupabaseUser(data.user);
        // El perfil se crea automáticamente en el signup
        await loadUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Intentar logout de Supabase
      const { error } = await auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
      }
      
      // Limpiar estado local
      if (typeof window !== 'undefined') {
        localStorage.removeItem('@trackport_user');
      } else {
        await AsyncStorage.removeItem('@trackport_user');
      }
      setUser(null);
      setSupabaseUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};