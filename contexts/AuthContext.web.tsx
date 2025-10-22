import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Local types to avoid import issues
type UserRole = 'client' | 'customer_service' | 'customs_broker' | 'sales' | 'main_admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  company?: string;
  isActive: boolean;
  createdAt: string;
}

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

// Mock users para web
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
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    console.log('=== INICIANDO LOGIN WEB ===');
    console.log('Email:', email);
    
    try {
      // Buscar usuario mock
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === '123456') {
        console.log('Usuario encontrado:', foundUser.name);
        
        // Guardar en localStorage para web
        if (typeof window !== 'undefined') {
          localStorage.setItem('trackport_user', JSON.stringify(foundUser));
        }
        
        setUser(foundUser);
        console.log('Login exitoso - usuario establecido');
        return;
      } else {
        console.log('Credenciales incorrectas');
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
      console.log('=== LOGIN COMPLETADO ===');
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('trackport_user');
      }
      setUser(null);
      setSupabaseUser(null);
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    throw new Error('Registro no disponible en modo demo');
  };

  // Verificar usuario guardado al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('trackport_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('Usuario recuperado del localStorage:', userData.email);
        }
      } catch (error) {
        console.error('Error recuperando usuario:', error);
      }
    }
    setLoading(false);
  }, []);

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