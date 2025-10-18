import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardStats } from '../../types';
import { Logo } from '../../components/Logo';

// Mock data for development
const getMockStats = (role: string): DashboardStats => {
  switch (role) {
    case 'client':
      return {
        totalContainers: 12,
        activeContainers: 8,
        pendingPayments: 3,
        completedContainers: 4,
        monthlyRevenue: 0,
        pendingInstructions: 2,
      };
    case 'customer_service':
      return {
        totalContainers: 156,
        activeContainers: 89,
        pendingPayments: 23,
        completedContainers: 67,
        monthlyRevenue: 0,
        pendingInstructions: 15,
      };
    case 'customs_broker':
      return {
        totalContainers: 234,
        activeContainers: 123,
        pendingPayments: 34,
        completedContainers: 111,
        monthlyRevenue: 0,
        pendingInstructions: 28,
      };
    case 'sales':
      return {
        totalContainers: 89,
        activeContainers: 45,
        pendingPayments: 12,
        completedContainers: 44,
        monthlyRevenue: 125000,
        pendingInstructions: 8,
      };
    case 'main_admin':
      return {
        totalContainers: 567,
        activeContainers: 289,
        pendingPayments: 78,
        completedContainers: 278,
        monthlyRevenue: 450000,
        pendingInstructions: 45,
      };
    default:
      return {
        totalContainers: 0,
        activeContainers: 0,
        pendingPayments: 0,
        completedContainers: 0,
        monthlyRevenue: 0,
        pendingInstructions: 0,
      };
  }
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const stats = getMockStats(user?.role || '');

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: logout },
      ]
    );
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      client: 'Cliente',
      customer_service: 'Servicio al Cliente',
      customs_broker: 'Agente Aduanal',
      sales: 'Ventas',
      main_admin: 'Administrador Principal',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'client':
        return [
          { title: 'Mis Contenedores', value: stats.totalContainers, icon: 'cube', color: '#1e3a8a' },
          { title: 'Activos', value: stats.activeContainers, icon: 'time', color: '#FF9500' },
          { title: 'Pagos Pendientes', value: stats.pendingPayments, icon: 'card', color: '#FF3B30' },
          { title: 'Cartas Pendientes', value: stats.pendingInstructions, icon: 'document-text', color: '#34C759' },
        ];
      
      case 'sales':
        return [
          { title: 'Contenedores Total', value: stats.totalContainers, icon: 'cube', color: '#1e3a8a' },
          { title: 'Ingresos del Mes', value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: 'trending-up', color: '#34C759' },
          { title: 'Clientes Activos', value: stats.activeContainers, icon: 'people', color: '#FF9500' },
          { title: 'Prospectos', value: stats.pendingInstructions, icon: 'person-add', color: '#5856D6' },
        ];
      
      default:
        return [
          { title: 'Total Contenedores', value: stats.totalContainers, icon: 'cube', color: '#1e3a8a' },
          { title: 'Activos', value: stats.activeContainers, icon: 'time', color: '#FF9500' },
          { title: 'Pagos Pendientes', value: stats.pendingPayments, icon: 'card', color: '#FF3B30' },
          { title: 'Completados', value: stats.completedContainers, icon: 'checkmark-circle', color: '#34C759' },
        ];
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Logo size="small" showText={false} variant="icon-only" />
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>¡Hola, {user?.name}!</Text>
            <Text style={styles.role}>{getRoleDisplayName(user?.role || '')}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <View style={styles.statsGrid}>
          {getStatsForRole().map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          {user?.role === 'client' && (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="add-circle" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Nueva Carta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="search" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Buscar Contenedor</Text>
              </TouchableOpacity>
            </>
          )}
          
          {user?.role === 'customer_service' && (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="people" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Gestionar Clientes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubbles" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Soporte</Text>
              </TouchableOpacity>
            </>
          )}
          
          {user?.role === 'customs_broker' && (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="document" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Subir Documentos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="checkmark-done" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Despacho Aduanal</Text>
              </TouchableOpacity>
            </>
          )}
          
          {user?.role === 'sales' && (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="person-add" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Nuevo Cliente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="bar-chart" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Reportes</Text>
              </TouchableOpacity>
            </>
          )}
          
          {user?.role === 'main_admin' && (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="people" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Gestionar Usuarios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="analytics" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="settings" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Configuración</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download" size={32} color="#1e3a8a" />
                <Text style={styles.actionText}>Exportar Datos</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingContainer: {
    marginLeft: 15,
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 10,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    padding: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});