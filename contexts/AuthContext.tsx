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

// Mock users for development (fallback)
const MOCK_USERS: User[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@track-port.com',
    name: 'Administrador Principal',
    role: 'main_admin',
    phone: '+52 (33) 1234-5678',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'cliente@track-port.com',
    name: 'Cliente Demo',
    role: 'client',
    phone: '+52 (33) 1234-5679',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'servicio@track-port.com',
    name: 'Servicio al Cliente',
    role: 'customer_service',
    phone: '+52 (33) 1234-5680',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'agente@track-port.com',
    name: 'Agente Aduanal',
    role: 'customs_broker',
    phone: '+52 (33) 1234-5681',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'ventas@track-port.com',
    name: 'Equipo de Ventas',
    role: 'sales',
    phone: '+52 (33) 1234-5682',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

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
      await AsyncStorage.setItem('@trackport_user', JSON.stringify(userProfile));
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const checkStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@trackport_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Intentar login con Supabase
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        // Fallback a autenticación mock para desarrollo
        console.log('Supabase login failed, using mock auth:', error.message);
        const foundUser = MOCK_USERS.find(u => u.email === email);
        if (foundUser && password === '123456') {
          await AsyncStorage.setItem('@trackport_user', JSON.stringify(foundUser));
          setUser(foundUser);
        } else {
          throw new Error('Credenciales inválidas');
        }
      } else if (data.user) {
        setSupabaseUser(data.user);
        await loadUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
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
      await AsyncStorage.removeItem('@trackport_user');
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