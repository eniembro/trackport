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
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { PaymentItem, PaymentStatus, PaymentType, PaymentSummary } from '../../types';
import { APP_CONFIG } from '../../utils/config';

// Mock data para desarrollo
const MOCK_PAYMENTS: PaymentItem[] = [
  {
    id: '1',
    type: 'taxes',
    description: 'Impuestos de importación - Componentes electrónicos',
    amount: 25000,
    currency: 'MXN',
    status: 'paid',
    dueDate: '2024-10-20',
    paidDate: '2024-10-18',
    containerId: 'container1',
    containerNumber: 'TCLU1234567',
    clientId: 'client1',
    clientName: 'Importadora ABC S.A. de C.V.',
    receipt: {
      id: 'receipt1',
      url: '/receipts/receipt-001.pdf',
      uploadedAt: '2024-10-18T14:30:00Z',
      uploadedBy: 'client1',
      fileName: 'Comprobante-Pago-Impuestos.pdf',
      fileSize: 1024576,
      verifiedBy: 'cs1',
      verifiedAt: '2024-10-18T16:00:00Z',
      verificationNotes: 'Comprobante válido, monto correcto',
    },
    paymentMethod: 'transfer',
    referenceNumber: 'TRF-20241018-001',
    statusHistory: [
      {
        status: 'pending',
        date: '2024-10-15T10:00:00Z',
        notes: 'Pago generado',
        userId: 'system',
        userName: 'Sistema',
      },
      {
        status: 'paid',
        date: '2024-10-18T14:30:00Z',
        notes: 'Pago realizado por transferencia',
        userId: 'client1',
        userName: 'Cliente ABC',
      },
      {
        status: 'verified',
        date: '2024-10-18T16:00:00Z',
        notes: 'Comprobante verificado',
        userId: 'cs1',
        userName: 'María González',
      },
    ],
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-10-18T16:00:00Z',
    createdBy: 'system',
    assignedTo: 'cs1',
    priority: 'high',
    tags: ['urgente', 'electronica'],
  },
  {
    id: '2',
    type: 'customsAgency',
    description: 'Honorarios agencia aduanal - Despacho contenedor MSKU9876543',
    amount: 8500,
    currency: 'MXN',
    status: 'pending',
    dueDate: '2024-10-25',
    containerId: 'container2',
    containerNumber: 'MSKU9876543',
    clientId: 'client2',
    clientName: 'Comercializadora XYZ',
    statusHistory: [
      {
        status: 'pending',
        date: '2024-10-20T09:00:00Z',
        notes: 'Honorarios calculados',
        userId: 'broker1',
        userName: 'Agente Aduanal',
      },
    ],
    createdAt: '2024-10-20T09:00:00Z',
    updatedAt: '2024-10-20T09:00:00Z',
    createdBy: 'broker1',
    assignedTo: 'cs1',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'storage',
    description: 'Almacenaje en puerto - 5 días extras',
    amount: 3200,
    currency: 'MXN',
    status: 'overdue',
    dueDate: '2024-10-15',
    containerId: 'container1',
    containerNumber: 'TCLU1234567',
    clientId: 'client1',
    clientName: 'Importadora ABC S.A. de C.V.',
    statusHistory: [
      {
        status: 'pending',
        date: '2024-10-10T15:00:00Z',
        notes: 'Cargo por almacenaje generado',
        userId: 'system',
        userName: 'Sistema',
      },
      {
        status: 'overdue',
        date: '2024-10-16T00:00:00Z',
        notes: 'Pago vencido',
        userId: 'system',
        userName: 'Sistema',
      },
    ],
    createdAt: '2024-10-10T15:00:00Z',
    updatedAt: '2024-10-16T00:00:00Z',
    createdBy: 'system',
    assignedTo: 'cs1',
    priority: 'urgent',
    tags: ['vencido'],
  },
  {
    id: '4',
    type: 'freight',
    description: 'Flete terrestre Manzanillo-Guadalajara',
    amount: 12000,
    currency: 'MXN',
    status: 'partially_paid',
    dueDate: '2024-10-30',
    paidDate: '2024-10-22',
    containerId: 'container3',
    containerNumber: 'CMAU5555555',
    clientId: 'client3',
    clientName: 'Distribuciones del Pacífico',
    receipt: {
      id: 'receipt2',
      url: '/receipts/receipt-002.pdf',
      uploadedAt: '2024-10-22T11:00:00Z',
      uploadedBy: 'client3',
      fileName: 'Anticipo-Flete-50pct.pdf',
      fileSize: 512000,
    },
    paymentMethod: 'transfer',
    referenceNumber: 'TRF-20241022-003',
    statusHistory: [
      {
        status: 'pending',
        date: '2024-10-18T12:00:00Z',
        notes: 'Cotización de flete aprobada',
        userId: 'sales1',
        userName: 'Vendedor',
      },
      {
        status: 'partially_paid',
        date: '2024-10-22T11:00:00Z',
        notes: 'Anticipo del 50% recibido',
        userId: 'client3',
        userName: 'Cliente Pacífico',
      },
    ],
    createdAt: '2024-10-18T12:00:00Z',
    updatedAt: '2024-10-22T11:00:00Z',
    createdBy: 'sales1',
    assignedTo: 'cs2',
    priority: 'medium',
    notes: 'Anticipo del 50%, resto contra entrega',
  },
];

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'all'>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'paid': return '#10b981';
      case 'verified': return '#059669';
      case 'rejected': return '#ef4444';
      case 'overdue': return '#dc2626';
      case 'partially_paid': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusName = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagado';
      case 'verified': return 'Verificado';
      case 'rejected': return 'Rechazado';
      case 'overdue': return 'Vencido';
      case 'partially_paid': return 'Pago Parcial';
      default: return status;
    }
  };

  const getPaymentTypeName = (type: PaymentType) => {
    const paymentType = APP_CONFIG.paymentTypes.find(pt => pt.key === type);
    return paymentType?.name || type;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getFilteredPayments = () => {
    let filtered = payments;

    // Filtrar por rol de usuario
    if (user?.role === 'client' && user.clientId) {
      filtered = payments.filter(p => p.clientId === user.clientId);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filtrar por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    return filtered;
  };

  const calculateSummary = (): PaymentSummary => {
    const filteredPayments = getFilteredPayments();
    
    const summary: PaymentSummary = {
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      itemsCount: {
        total: filteredPayments.length,
        paid: 0,
        pending: 0,
        overdue: 0,
      },
      byType: {} as any,
    };

    // Initialize byType
    APP_CONFIG.paymentTypes.forEach(type => {
      summary.byType[type.key as PaymentType] = {
        count: 0,
        totalAmount: 0,
        paidAmount: 0,
      };
    });

    filteredPayments.forEach(payment => {
      summary.totalAmount += payment.amount;
      
      if (payment.status === 'paid' || payment.status === 'verified') {
        summary.paidAmount += payment.amount;
        summary.itemsCount.paid++;
      } else if (payment.status === 'overdue') {
        summary.overdueAmount += payment.amount;
        summary.itemsCount.overdue++;
      } else {
        summary.pendingAmount += payment.amount;
        summary.itemsCount.pending++;
      }

      // By type
      if (summary.byType[payment.type]) {
        summary.byType[payment.type].count++;
        summary.byType[payment.type].totalAmount += payment.amount;
        if (payment.status === 'paid' || payment.status === 'verified') {
          summary.byType[payment.type].paidAmount += payment.amount;
        }
      }
    });

    return summary;
  };

  const handlePaymentPress = (payment: PaymentItem) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleStatusChange = (paymentId: string, newStatus: PaymentStatus, notes?: string) => {
    setPayments(prev => prev.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...(newStatus === 'paid' && !payment.paidDate ? { paidDate: new Date().toISOString() } : {}),
          statusHistory: [
            ...payment.statusHistory,
            {
              status: newStatus,
              date: new Date().toISOString(),
              notes: notes || '',
              userId: user?.id || '',
              userName: user?.name || 'Usuario',
            }
          ]
        };
      }
      return payment;
    }));
    Alert.alert('Éxito', 'Estado actualizado correctamente');
  };

  const summary = calculateSummary();

  const renderPaymentCard = (payment: PaymentItem) => {
    const statusColor = getStatusColor(payment.status);
    const priorityColor = getPriorityColor(payment.priority);
    const isOverdue = payment.status === 'overdue' || (payment.status === 'pending' && new Date(payment.dueDate) < new Date());

    return (
      <TouchableOpacity
        key={payment.id}
        style={[styles.paymentCard, isOverdue && styles.overdueCard]}
        onPress={() => handlePaymentPress(payment)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.paymentInfo}>
            <View style={styles.headerRow}>
              <Text style={styles.paymentType}>
                {getPaymentTypeName(payment.type)}
              </Text>
              <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
            </View>
            <Text style={styles.containerNumber}>
              {payment.containerNumber} - {payment.clientName}
            </Text>
            <Text style={styles.paymentDescription} numberOfLines={2}>
              {payment.description}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{getStatusName(payment.status)}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Monto:</Text>
            <Text style={[styles.amount, { color: isOverdue ? '#dc2626' : '#1e3a8a' }]}>
              ${payment.amount.toLocaleString()} {payment.currency}
            </Text>
          </View>

          <View style={styles.datesContainer}>
            <View style={styles.dateInfo}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.dateText}>
                Vence: {new Date(payment.dueDate).toLocaleDateString()}
                {isOverdue && <Text style={styles.overdueText}> (VENCIDO)</Text>}
              </Text>
            </View>
            
            {payment.paidDate && (
              <View style={styles.dateInfo}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.dateText}>
                  Pagado: {new Date(payment.paidDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          {payment.receipt && (
            <View style={styles.receiptInfo}>
              <Ionicons name="document-attach" size={16} color="#10b981" />
              <Text style={styles.receiptText}>
                Comprobante subido
                {payment.receipt.verifiedAt && ' ✓'}
              </Text>
            </View>
          )}

          {payment.tags && payment.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {payment.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          {(payment.status === 'pending' || payment.status === 'overdue') ? (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="card" size={16} color="#1e3a8a" />
                <Text style={styles.actionText}>Pagar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  setSelectedPayment(payment);
                  setShowUploadModal(true);
                }}
              >
                <Ionicons name="cloud-upload" size={16} color="#1e3a8a" />
                <Text style={styles.actionText}>Subir Receipt</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye" size={16} color="#1e3a8a" />
                <Text style={styles.actionText}>Ver Receipt</Text>
              </TouchableOpacity>
              {user?.role !== 'client' && payment.receipt && !payment.receipt.verifiedAt && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleStatusChange(payment.id, 'verified', 'Comprobante verificado')}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={[styles.actionText, { color: '#10b981' }]}>Verificar</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Pagos</Text>
        <Text style={styles.subtitle}>
          {user?.role === 'client' ? 'Mis Pagos' : 'Control de Receipts'}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por contenedor, cliente o referencia..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Estado:</Text>
            <TouchableOpacity
              style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}
              onPress={() => setStatusFilter('all')}
            >
              <Text style={[styles.filterText, statusFilter === 'all' && styles.filterTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>

            {['pending', 'paid', 'verified', 'overdue'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  statusFilter === status && styles.filterChipActive,
                  { borderColor: getStatusColor(status as PaymentStatus) }
                ]}
                onPress={() => setStatusFilter(status as PaymentStatus)}
              >
                <Text
                  style={[
                    styles.filterText,
                    statusFilter === status && styles.filterTextActive
                  ]}
                >
                  {getStatusName(status as PaymentStatus)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.paymentsContainer}>
        {/* Resumen de pagos */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={[styles.summaryAmount, { color: '#1e3a8a' }]}>
                ${summary.totalAmount.toLocaleString()}
              </Text>
              <Text style={styles.summaryCount}>{summary.itemsCount.total} pagos</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Pendiente</Text>
              <Text style={[styles.summaryAmount, { color: '#f59e0b' }]}>
                ${summary.pendingAmount.toLocaleString()}
              </Text>
              <Text style={styles.summaryCount}>{summary.itemsCount.pending} pagos</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Pagado</Text>
              <Text style={[styles.summaryAmount, { color: '#10b981' }]}>
                ${summary.paidAmount.toLocaleString()}
              </Text>
              <Text style={styles.summaryCount}>{summary.itemsCount.paid} pagos</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Vencido</Text>
              <Text style={[styles.summaryAmount, { color: '#dc2626' }]}>
                ${summary.overdueAmount.toLocaleString()}
              </Text>
              <Text style={styles.summaryCount}>{summary.itemsCount.overdue} pagos</Text>
            </View>
          </View>
        </View>

        {/* Botón para subir receipt global */}
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setShowUploadModal(true)}
        >
          <Ionicons name="cloud-upload" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Subir Comprobante de Pago</Text>
        </TouchableOpacity>

        {/* Lista de pagos */}
        {getFilteredPayments().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No se encontraron pagos</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay pagos registrados aún'}
            </Text>
          </View>
        ) : (
          getFilteredPayments().map(renderPaymentCard)
        )}
      </ScrollView>

      {/* Modal de detalles del pago */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Detalles del Pago
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedPayment && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Información General</Text>
                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Tipo:</Text>
                      <Text style={styles.detailValue}>{getPaymentTypeName(selectedPayment.type)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Estado:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedPayment.status) }]}>
                        <Text style={styles.statusText}>{getStatusName(selectedPayment.status)}</Text>
                      </View>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Monto:</Text>
                      <Text style={styles.detailValue}>
                        ${selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Prioridad:</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedPayment.priority) }]}>
                        <Text style={styles.statusText}>{selectedPayment.priority.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {selectedPayment.receipt && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Comprobante de Pago</Text>
                    <View style={styles.receiptDetails}>
                      <View style={styles.receiptHeader}>
                        <Ionicons name="document-text" size={24} color="#10b981" />
                        <View style={styles.receiptInfo}>
                          <Text style={styles.receiptFileName}>{selectedPayment.receipt.fileName}</Text>
                          <Text style={styles.receiptSize}>
                            {(selectedPayment.receipt.fileSize / 1024 / 1024).toFixed(2)} MB
                          </Text>
                        </View>
                        {selectedPayment.receipt.verifiedAt && (
                          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                        )}
                      </View>
                      
                      <Text style={styles.receiptDate}>
                        Subido: {new Date(selectedPayment.receipt.uploadedAt).toLocaleDateString()}
                      </Text>
                      
                      {selectedPayment.receipt.verifiedAt && (
                        <View style={styles.verificationInfo}>
                          <Text style={styles.verificationText}>
                            Verificado por {selectedPayment.receipt.verifiedBy} el{' '}
                            {new Date(selectedPayment.receipt.verifiedAt).toLocaleDateString()}
                          </Text>
                          {selectedPayment.receipt.verificationNotes && (
                            <Text style={styles.verificationNotes}>
                              {selectedPayment.receipt.verificationNotes}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.actionsSection}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="download" size={20} color="#1e3a8a" />
                    <Text style={styles.actionButtonText}>Descargar Receipt</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="create" size={20} color="#1e3a8a" />
                    <Text style={styles.actionButtonText}>Editar Pago</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de subida de receipt - placeholder */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Subir Comprobante</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.comingSoon}>
              Sistema de upload de comprobantes próximamente...
            </Text>
          </View>
        </View>
      </Modal>
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
  filters: {
    flexDirection: 'row',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  paymentsContainer: {
    flex: 1,
    padding: 20,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  summaryCount: {
    fontSize: 11,
    color: '#999',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  containerNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 13,
    color: '#999',
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
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  datesContainer: {
    gap: 8,
    marginBottom: 10,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  overdueText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  receiptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  tagText: {
    fontSize: 11,
    color: '#92400e',
    fontWeight: '500',
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
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '500',
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
  detailGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  receiptDetails: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptFileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  receiptSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  receiptDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  verificationInfo: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  verificationText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
  verificationNotes: {
    fontSize: 13,
    color: '#15803d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionsSection: {
    marginTop: 20,
    gap: 10,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  comingSoon: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});