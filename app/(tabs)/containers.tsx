import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Container, ContainerStatus } from '../../types';
import { APP_CONFIG } from '../../utils/config';

// Mock data para desarrollo
const MOCK_CONTAINERS: Container[] = [
  {
    id: '1',
    number: 'TCLU1234567',
    status: 'arrival_date',
    arrivalDate: '2024-10-15',
    previewDate: '2024-10-16',
    currentLocation: 'Puerto de Manzanillo',
    statusHistory: [
      { status: 'arrival_date', date: '2024-10-15', notes: 'Contenedor arribó al puerto' }
    ],
    createdAt: '2024-10-15T08:00:00Z',
    updatedAt: '2024-10-15T08:00:00Z',
  },
  {
    id: '2',
    number: 'MSKU9876543',
    status: 'taxes_paid',
    arrivalDate: '2024-10-10',
    previewDate: '2024-10-11',
    currentLocation: 'Almacén Fiscal',
    statusHistory: [
      { status: 'arrival_date', date: '2024-10-10', notes: 'Llegada registrada' },
      { status: 'preview_date', date: '2024-10-11', notes: 'Previo realizado' },
      { status: 'proforma_uploaded', date: '2024-10-12', notes: 'Documentos subidos' },
      { status: 'taxes_paid', date: '2024-10-13', notes: 'Impuestos pagados', amount: 15000 }
    ],
    createdAt: '2024-10-10T09:30:00Z',
    updatedAt: '2024-10-13T14:20:00Z',
  },
  {
    id: '3',
    number: 'CMAU5555555',
    status: 'container_released',
    arrivalDate: '2024-10-01',
    previewDate: '2024-10-02',
    currentLocation: 'Entregado',
    statusHistory: [
      { status: 'arrival_date', date: '2024-10-01', notes: 'Arribó sin problemas' },
      { status: 'container_released', date: '2024-10-08', notes: 'Proceso completado exitosamente' }
    ],
    createdAt: '2024-10-01T10:15:00Z',
    updatedAt: '2024-10-08T16:45:00Z',
  },
];

export default function Containers() {
  const { user } = useAuth();
  const [containers, setContainers] = useState<Container[]>(MOCK_CONTAINERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContainerStatus | 'all'>('all');
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: ContainerStatus) => {
    const statusConfig = APP_CONFIG.containerStatuses.find(s => s.key === status);
    return statusConfig?.color || '#666';
  };

  const getStatusName = (status: ContainerStatus) => {
    const statusConfig = APP_CONFIG.containerStatuses.find(s => s.key === status);
    return statusConfig?.name || status;
  };

  const getFilteredContainers = () => {
    let filtered = containers;

    // Filtrar por rol de usuario
    if (user?.role === 'client' && user.clientId) {
      // Los clientes solo ven sus contenedores
      filtered = containers.filter(c => c.instructionLetter?.clientId === user.clientId);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.currentLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    return filtered;
  };

  const getStatusProgress = (status: ContainerStatus) => {
    const statusIndex = APP_CONFIG.containerStatuses.findIndex(s => s.key === status);
    return ((statusIndex + 1) / APP_CONFIG.containerStatuses.length) * 100;
  };

  const handleContainerPress = (container: Container) => {
    setSelectedContainer(container);
    setShowModal(true);
  };

  const renderContainerCard = (container: Container) => {
    const progress = getStatusProgress(container.status);
    const statusColor = getStatusColor(container.status);

    return (
      <TouchableOpacity
        key={container.id}
        style={styles.containerCard}
        onPress={() => handleContainerPress(container)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.containerNumber}>{container.number}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{getStatusName(container.status)}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.infoText}>{container.currentLocation}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.infoText}>
              Llegada: {new Date(container.arrivalDate || '').toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: statusColor }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatusHistory = (history: Container['statusHistory']) => {
    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Historial de Estados</Text>
        {history.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: getStatusColor(item.status) }]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStatus}>{getStatusName(item.status)}</Text>
              <Text style={styles.timelineDate}>
                {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString()}
              </Text>
              {item.notes && <Text style={styles.timelineNotes}>{item.notes}</Text>}
              {item.amount && (
                <Text style={styles.timelineAmount}>
                  Monto: ${item.amount.toLocaleString()}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Contenedores</Text>
        <Text style={styles.subtitle}>
          {user?.role === 'client' ? 'Mis Contenedores' : 'Todos los Contenedores'}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por número o ubicación..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}
            onPress={() => setStatusFilter('all')}
          >
            <Text style={[styles.filterText, statusFilter === 'all' && styles.filterTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          {APP_CONFIG.containerStatuses.slice(0, 6).map((status) => (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.filterChip,
                statusFilter === status.key && styles.filterChipActive,
                { borderColor: status.color }
              ]}
              onPress={() => setStatusFilter(status.key as ContainerStatus)}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === status.key && styles.filterTextActive
                ]}
              >
                {status.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.containersContainer}>
        {getFilteredContainers().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No se encontraron contenedores</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay contenedores registrados aún'}
            </Text>
          </View>
        ) : (
          getFilteredContainers().map(renderContainerCard)
        )}
      </ScrollView>

      {/* Modal de detalles del contenedor */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedContainer?.number}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedContainer && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Información General</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Estado Actual:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedContainer.status) }]}>
                      <Text style={styles.statusText}>{getStatusName(selectedContainer.status)}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ubicación:</Text>
                    <Text style={styles.detailValue}>{selectedContainer.currentLocation}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fecha de Llegada:</Text>
                    <Text style={styles.detailValue}>
                      {selectedContainer.arrivalDate ? new Date(selectedContainer.arrivalDate).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                  {selectedContainer.previewDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Fecha de Previo:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(selectedContainer.previewDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                {renderStatusHistory(selectedContainer.statusHistory)}

                <View style={styles.actionsSection}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="document-text" size={20} color="#1e3a8a" />
                    <Text style={styles.actionButtonText}>Ver Documentos</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="card" size={20} color="#1e3a8a" />
                    <Text style={styles.actionButtonText}>Gestionar Pagos</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
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
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
  },
  statusFilters: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  containersContainer: {
    flex: 1,
    padding: 20,
  },
  containerCard: {
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
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  containerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1e3a8a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timelineContainer: {
    marginBottom: 25,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 15,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timelineDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timelineNotes: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  timelineAmount: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    marginTop: 5,
  },
  actionsSection: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '500',
  },
});