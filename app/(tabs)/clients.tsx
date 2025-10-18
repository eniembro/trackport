import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function Clients() {
  const { user } = useAuth();

  const mockClients = [
    {
      id: '1',
      name: 'Importadora ABC S.A. de C.V.',
      email: 'contacto@importadoraabc.com',
      phone: '+52 33 1234 5678',
      activeContainers: 3,
      totalContainers: 15,
      status: 'active',
      lastActivity: '2024-10-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Comercializadora XYZ',
      email: 'ventas@comercializadoraxyz.com',
      phone: '+52 33 8765 4321',
      activeContainers: 1,
      totalContainers: 8,
      status: 'active',
      lastActivity: '2024-10-14T16:45:00Z',
    },
    {
      id: '3',
      name: 'Distribuciones del Pacífico',
      email: 'admin@dispacifico.com',
      phone: '+52 33 5555 0000',
      activeContainers: 0,
      totalContainers: 23,
      status: 'inactive',
      lastActivity: '2024-09-28T09:15:00Z',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'inactive': return '#FF9500';
      case 'suspended': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Clientes</Text>
        <Text style={styles.subtitle}>Administración de cuentas</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="person-add" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Nuevo Cliente</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockClients.length}</Text>
            <Text style={styles.statLabel}>Total Clientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {mockClients.filter(c => c.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Activos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {mockClients.reduce((sum, c) => sum + c.activeContainers, 0)}
            </Text>
            <Text style={styles.statLabel}>Contenedores Activos</Text>
          </View>
        </View>

        <View style={styles.clientsList}>
          <Text style={styles.sectionTitle}>Lista de Clientes</Text>
          
          {mockClients.map((client) => (
            <View key={client.id} style={styles.clientCard}>
              <View style={styles.cardHeader}>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientEmail}>{client.email}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
                  <Text style={styles.statusText}>{getStatusName(client.status)}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.contactInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="call" size={16} color="#666" />
                    <Text style={styles.infoText}>{client.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      Última actividad: {new Date(client.lastActivity).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.containerStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{client.activeContainers}</Text>
                    <Text style={styles.statName}>Activos</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{client.totalContainers}</Text>
                    <Text style={styles.statName}>Total</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye" size={16} color="#1e3a8a" />
                  <Text style={styles.actionText}>Ver Detalles</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="cube" size={16} color="#1e3a8a" />
                  <Text style={styles.actionText}>Contenedores</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create" size={16} color="#1e3a8a" />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  clientsList: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  clientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clientEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 15,
  },
  contactInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  containerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  statName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 13,
    color: '#1e3a8a',
    fontWeight: '500',
  },
});