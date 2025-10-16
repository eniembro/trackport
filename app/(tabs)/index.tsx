import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const { user } = useAuth();

  const getDashboardByRole = () => {
    switch (user?.role) {
      case 'main_admin':
        return {
          title: 'Panel de Administración',
          cards: [
            { title: 'Contenedores Activos', value: '24', icon: '📦', color: Colors.primary },
            { title: 'Usuarios', value: '156', icon: '👥', color: Colors.success },
            { title: 'Cartas Pendientes', value: '8', icon: '📋', color: Colors.warning },
            { title: 'Ingresos Mes', value: '$125,000', icon: '💰', color: Colors.primary },
          ],
        };
      case 'client':
        return {
          title: 'Mis Contenedores',
          cards: [
            { title: 'En Tránsito', value: '3', icon: '🚢', color: Colors.primary },
            { title: 'En Puerto', value: '2', icon: '⚓', color: Colors.warning },
            { title: 'Listos', value: '1', icon: '✅', color: Colors.success },
            { title: 'Cartas Pendientes', value: '2', icon: '📋', color: Colors.error },
          ],
        };
      case 'customer_service':
        return {
          title: 'Servicio al Cliente',
          cards: [
            { title: 'Cartas por Revisar', value: '12', icon: '📋', color: Colors.warning },
            { title: 'Documentos Pendientes', value: '5', icon: '📄', color: Colors.error },
            { title: 'Aprobadas Hoy', value: '8', icon: '✅', color: Colors.success },
            { title: 'Clientes Activos', value: '45', icon: '👥', color: Colors.primary },
          ],
        };
      default:
        return {
          title: 'Dashboard',
          cards: [
            { title: 'Contenedores', value: '15', icon: '📦', color: Colors.primary },
            { title: 'Documentos', value: '32', icon: '📄', color: Colors.success },
          ],
        };
    }
  };

  const dashboard = getDashboardByRole();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bienvenido, {user?.name}</Text>
        <Text style={styles.title}>{dashboard.title}</Text>
      </View>

      <View style={styles.cardsContainer}>
        {dashboard.cards.map((card, index) => (
          <TouchableOpacity key={index} style={[styles.card, { borderLeftColor: card.color }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardValue}>{card.value}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
              </View>
              <View style={[styles.cardIcon, { backgroundColor: card.color }]}>
                <Text style={styles.iconText}>{card.icon}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        {user?.role === 'client' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Nueva Carta de Instrucciones</Text>
          </TouchableOpacity>
        )}

        {user?.role === 'main_admin' && (
          <>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Gestionar Usuarios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Ver Reportes</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>Ver Contenedores</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  welcome: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  cardsContainer: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
});
