import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  const getTabScreens = () => {
    const commonScreens = [
      {
        name: 'index',
        options: {
          title: 'Dashboard',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        },
      },
    ];

    const aboutScreen = {
      name: 'about',
      options: {
        title: 'Acerca de',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Ionicons name="information-circle" size={size} color={color} />
        ),
      },
    };

    switch (user?.role) {
      case 'client':
        return [
          ...commonScreens,
          {
            name: 'containers',
            options: {
              title: 'Contenedores',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="cube" size={size} color={color} />
              ),
            },
          },
          {
            name: 'instructions',
            options: {
              title: 'Cartas',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="document-text" size={size} color={color} />
              ),
            },
          },
          {
            name: 'payments',
            options: {
              title: 'Pagos',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="card" size={size} color={color} />
              ),
            },
          },
          aboutScreen,
        ];

      case 'customer_service':
        return [
          ...commonScreens,
          {
            name: 'containers',
            options: {
              title: 'Contenedores',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="cube" size={size} color={color} />
              ),
            },
          },
          {
            name: 'clients',
            options: {
              title: 'Clientes',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="people" size={size} color={color} />
              ),
            },
          },
          {
            name: 'support',
            options: {
              title: 'Soporte',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="help-circle" size={size} color={color} />
              ),
            },
          },
          aboutScreen,
        ];

      case 'customs_broker':
        return [
          ...commonScreens,
          {
            name: 'containers',
            options: {
              title: 'Contenedores',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="cube" size={size} color={color} />
              ),
            },
          },
          {
            name: 'documents',
            options: {
              title: 'Documentos',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="folder" size={size} color={color} />
              ),
            },
          },
          {
            name: 'customs',
            options: {
              title: 'Aduana',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="checkmark-circle" size={size} color={color} />
              ),
            },
          },
          aboutScreen,
        ];

      case 'sales':
        return [
          ...commonScreens,
          {
            name: 'clients',
            options: {
              title: 'Clientes',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="people" size={size} color={color} />
              ),
            },
          },
          {
            name: 'leads',
            options: {
              title: 'Prospectos',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="person-add" size={size} color={color} />
              ),
            },
          },
          {
            name: 'reports',
            options: {
              title: 'Reportes',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="bar-chart" size={size} color={color} />
              ),
            },
          },
          aboutScreen,
        ];

      case 'main_admin':
        return [
          ...commonScreens,
          {
            name: 'containers',
            options: {
              title: 'Contenedores',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="cube" size={size} color={color} />
              ),
            },
          },
          {
            name: 'admin',
            options: {
              title: 'Admin',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="shield-checkmark" size={size} color={color} />
              ),
            },
          },
          {
            name: 'reports',
            options: {
              title: 'Reportes',
              tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                <Ionicons name="analytics" size={size} color={color} />
              ),
            },
          },
          aboutScreen,
        ];

      default:
        return [...commonScreens, aboutScreen];
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1e3a8a',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      {getTabScreens().map((screen) => (
        <Tabs.Screen key={screen.name} name={screen.name} options={screen.options} />
      ))}
    </Tabs>
  );
}