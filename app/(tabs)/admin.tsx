import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types';
import { APP_CONFIG } from '../../utils/config';

export default function AdminPanel() {
  const { user } = useAuth();

  // Verificar que solo main_admin acceda
  if (user?.role !== 'main_admin') {
    return (
      <View style={styles.unauthorizedContainer}>
        <Ionicons name="lock-closed" size={64} color="#ef4444" />
        <Text style={styles.unauthorizedText}>Acceso Restringido</Text>
        <Text style={styles.unauthorizedSubtext}>
          Solo los administradores principales pueden acceder a este panel
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Control total del sistema</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#3b82f6" />
            <Text style={styles.statNumber}>25</Text>
            <Text style={styles.statLabel}>Usuarios Totales</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="cube" size={32} color="#10b981" />
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>Contenedores Activos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={32} color="#f59e0b" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Documentos Pendientes</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="analytics" size={32} color="#8b5cf6" />
            <Text style={styles.statNumber}>$234K</Text>
            <Text style={styles.statLabel}>Ingresos del Mes</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="person-add" size={24} color="#1e3a8a" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Gestionar Usuarios</Text>
              <Text style={styles.actionDescription}>Crear, editar y administrar cuentas de usuario</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="settings" size={24} color="#1e3a8a" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Configuración del Sistema</Text>
              <Text style={styles.actionDescription}>Ajustar parámetros generales y configuraciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="bar-chart" size={24} color="#1e3a8a" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Reportes Avanzados</Text>
              <Text style={styles.actionDescription}>Generar reportes ejecutivos y analytics</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="shield-checkmark" size={24} color="#1e3a8a" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Logs del Sistema</Text>
              <Text style={styles.actionDescription}>Monitorear actividad y eventos del sistema</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.systemStatus}>
          <Text style={styles.sectionTitle}>Estado del Sistema</Text>
          
          <View style={styles.statusItem}>
            <Ionicons name="server" size={24} color="#10b981" />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Servidor</Text>
              <Text style={[styles.statusValue, { color: '#10b981' }]}>Operativo</Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Ionicons name="cloud" size={24} color="#10b981" />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Base de Datos</Text>
              <Text style={[styles.statusValue, { color: '#10b981' }]}>Conectada</Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Ionicons name="wifi" size={24} color="#10b981" />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Conectividad</Text>
              <Text style={[styles.statusValue, { color: '#10b981' }]}>Estable</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  unauthorizedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 20,
    textAlign: 'center',
  },
  unauthorizedSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  quickActions: {
    marginBottom: 30,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionContent: {
    flex: 1,
    marginLeft: 15,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  systemStatus: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusInfo: {
    marginLeft: 15,
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusValue: {
    fontSize: 14,
    marginTop: 2,
  },
});