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
import { InstructionLetter, InstructionStatus, InstructionDocument } from '../../types';
import { APP_CONFIG } from '../../utils/config';

// Mock data para desarrollo
const MOCK_INSTRUCTIONS: InstructionLetter[] = [
  {
    id: '1',
    number: 'CI-2024-001',
    clientId: 'client1',
    clientName: 'Importadora ABC S.A. de C.V.',
    clientEmail: 'contacto@importadoraabc.com',
    containerNumber: 'TCLU1234567',
    containerId: 'container1',
    status: 'approved',
    shipment: {
      origin: 'Shanghai, China',
      destination: 'Manzanillo, México',
      shipmentDate: '2024-10-10',
      estimatedArrival: '2024-10-15',
      vessel: 'MSC OSCAR',
      voyage: '245W',
      bl_number: 'MSCU123456789',
    },
    cargo: {
      description: 'Componentes electrónicos diversos',
      hsCode: '8542.31.00',
      quantity: 500,
      unit: 'Piezas',
      weight: 2500,
      value: 45000,
      currency: 'USD',
      incoterm: 'CIF',
    },
    documents: [
      {
        id: 'doc1',
        type: 'commercial_invoice',
        name: 'Factura Comercial - INV-2024-001.pdf',
        url: '/docs/factura-comercial.pdf',
        size: 2048576,
        mimeType: 'application/pdf',
        uploadedAt: '2024-10-12T10:30:00Z',
        uploadedBy: 'client1',
        isRequired: true,
        validationStatus: 'approved',
        validatedBy: 'cs1',
        validatedAt: '2024-10-12T15:20:00Z',
      },
      {
        id: 'doc2',
        type: 'packing_list',
        name: 'Lista de Empaque - PL-2024-001.pdf',
        url: '/docs/lista-empaque.pdf',
        size: 1024768,
        mimeType: 'application/pdf',
        uploadedAt: '2024-10-12T11:00:00Z',
        uploadedBy: 'client1',
        isRequired: true,
        validationStatus: 'approved',
        validatedBy: 'cs1',
        validatedAt: '2024-10-12T15:25:00Z',
      },
    ],
    requiredDocuments: ['commercial_invoice', 'packing_list', 'bill_of_lading'],
    services: {
      customsClearance: true,
      transportation: true,
      insurance: false,
      storage: true,
      inspection: false,
    },
    contacts: {
      consignee: {
        name: 'Importadora ABC S.A. de C.V.',
        address: 'Av. Industrial 123, Guadalajara, JAL',
        phone: '+52 33 1234 5678',
        email: 'recepcion@importadoraabc.com',
      },
    },
    statusHistory: [
      {
        status: 'draft',
        date: '2024-10-12T09:00:00Z',
        notes: 'Carta instrucción creada',
        userId: 'client1',
        userName: 'Cliente ABC',
      },
      {
        status: 'pending_review',
        date: '2024-10-12T12:00:00Z',
        notes: 'Enviada para revisión',
        userId: 'client1',
        userName: 'Cliente ABC',
      },
      {
        status: 'approved',
        date: '2024-10-12T16:00:00Z',
        notes: 'Documentos aprobados, proceso iniciado',
        userId: 'cs1',
        userName: 'María González',
      },
    ],
    notes: 'Envío urgente, coordinar llegada',
    createdAt: '2024-10-12T09:00:00Z',
    updatedAt: '2024-10-12T16:00:00Z',
    createdBy: 'client1',
    assignedTo: 'cs1',
    reviewedBy: 'cs1',
    reviewedAt: '2024-10-12T15:30:00Z',
    approvedBy: 'cs1',
    approvedAt: '2024-10-12T16:00:00Z',
  },
  {
    id: '2',
    number: 'CI-2024-002',
    clientId: 'client2',
    clientName: 'Comercializadora XYZ',
    clientEmail: 'ventas@comercializadoraxyz.com',
    status: 'pending_review',
    shipment: {
      origin: 'Los Angeles, USA',
      destination: 'Manzanillo, México',
      estimatedArrival: '2024-10-20',
      vessel: 'EVER GIVEN',
      voyage: '156E',
    },
    cargo: {
      description: 'Textiles y confecciones',
      quantity: 1000,
      unit: 'Piezas',
      weight: 1500,
      value: 25000,
      currency: 'USD',
    },
    documents: [
      {
        id: 'doc3',
        type: 'commercial_invoice',
        name: 'Invoice-XYZ-001.pdf',
        url: '/docs/invoice-xyz.pdf',
        size: 1500000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-10-14T14:00:00Z',
        uploadedBy: 'client2',
        isRequired: true,
        validationStatus: 'pending',
      },
    ],
    requiredDocuments: ['commercial_invoice', 'packing_list', 'bill_of_lading'],
    services: {
      customsClearance: true,
      transportation: false,
      insurance: true,
      storage: false,
      inspection: true,
    },
    contacts: {},
    statusHistory: [
      {
        status: 'draft',
        date: '2024-10-14T13:00:00Z',
        notes: 'Carta creada',
        userId: 'client2',
        userName: 'Cliente XYZ',
      },
      {
        status: 'pending_review',
        date: '2024-10-14T15:00:00Z',
        notes: 'Enviada para revisión',
        userId: 'client2',
        userName: 'Cliente XYZ',
      },
    ],
    createdAt: '2024-10-14T13:00:00Z',
    updatedAt: '2024-10-14T15:00:00Z',
    createdBy: 'client2',
    assignedTo: 'cs1',
  },
];

export default function Instructions() {
  const { user } = useAuth();
  const [instructions, setInstructions] = useState<InstructionLetter[]>(MOCK_INSTRUCTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InstructionStatus | 'all'>('all');
  const [selectedInstruction, setSelectedInstruction] = useState<InstructionLetter | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: InstructionStatus) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'pending_review': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'requires_changes': return '#f97316';
      case 'processing': return '#3b82f6';
      case 'completed': return '#059669';
      default: return '#6b7280';
    }
  };

  const getStatusName = (status: InstructionStatus) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'pending_review': return 'En Revisión';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'requires_changes': return 'Requiere Cambios';
      case 'processing': return 'En Proceso';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'commercial_invoice': return 'Factura Comercial';
      case 'packing_list': return 'Lista de Empaque';
      case 'bill_of_lading': return 'Conocimiento de Embarque';
      case 'certificate_origin': return 'Certificado de Origen';
      case 'other': return 'Otro';
      default: return type;
    }
  };

  const getFilteredInstructions = () => {
    let filtered = instructions;

    // Filtrar por rol de usuario
    if (user?.role === 'client' && user.clientId) {
      filtered = instructions.filter(i => i.clientId === user.clientId);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(i =>
        i.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.containerNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    return filtered;
  };

  const handleInstructionPress = (instruction: InstructionLetter) => {
    setSelectedInstruction(instruction);
    setShowModal(true);
  };

  const handleStatusChange = (instructionId: string, newStatus: InstructionStatus, notes?: string) => {
    setInstructions(prev => prev.map(instruction => {
      if (instruction.id === instructionId) {
        return {
          ...instruction,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...instruction.statusHistory,
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
      return instruction;
    }));
    Alert.alert('Éxito', 'Estado actualizado correctamente');
  };

  const renderInstructionCard = (instruction: InstructionLetter) => {
    const statusColor = getStatusColor(instruction.status);
    const missingDocs = instruction.requiredDocuments.length - instruction.documents.filter(d => d.validationStatus === 'approved').length;

    return (
      <TouchableOpacity
        key={instruction.id}
        style={styles.instructionCard}
        onPress={() => handleInstructionPress(instruction)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.instructionInfo}>
            <Text style={styles.instructionNumber}>{instruction.number}</Text>
            <Text style={styles.clientName}>{instruction.clientName}</Text>
            {instruction.containerNumber && (
              <Text style={styles.containerRef}>
                Contenedor: {instruction.containerNumber}
              </Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{getStatusName(instruction.status)}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Ionicons name="cube" size={16} color="#666" />
            <Text style={styles.infoText}>
              {instruction.cargo.description}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.infoText}>
              Creada: {new Date(instruction.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="document-text" size={16} color="#666" />
            <Text style={styles.infoText}>
              {instruction.documents.length} documentos subidos
            </Text>
            {missingDocs > 0 && (
              <Text style={[styles.infoText, { color: '#ef4444', marginLeft: 10 }]}>
                ({missingDocs} pendientes)
              </Text>
            )}
          </View>

          <View style={styles.servicesContainer}>
            {instruction.services.customsClearance && (
              <View style={styles.serviceChip}>
                <Text style={styles.serviceText}>Despacho Aduanal</Text>
              </View>
            )}
            {instruction.services.transportation && (
              <View style={styles.serviceChip}>
                <Text style={styles.serviceText}>Transporte</Text>
              </View>
            )}
            {instruction.services.storage && (
              <View style={styles.serviceChip}>
                <Text style={styles.serviceText}>Almacenaje</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye" size={16} color="#1e3a8a" />
            <Text style={styles.actionText}>Ver Detalles</Text>
          </TouchableOpacity>
          
          {user?.role !== 'client' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                // Mostrar opciones de cambio de estado
                Alert.alert(
                  'Cambiar Estado',
                  'Seleccione el nuevo estado',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Aprobar', onPress: () => handleStatusChange(instruction.id, 'approved') },
                    { text: 'Rechazar', onPress: () => handleStatusChange(instruction.id, 'rejected') },
                    { text: 'Requiere Cambios', onPress: () => handleStatusChange(instruction.id, 'requires_changes') },
                  ]
                );
              }}
            >
              <Ionicons name="create" size={16} color="#1e3a8a" />
              <Text style={styles.actionText}>Gestionar</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderDocumentsList = (documents: InstructionDocument[]) => {
    return (
      <View style={styles.documentsSection}>
        <Text style={styles.sectionTitle}>Documentos ({documents.length})</Text>
        {documents.map((doc) => (
          <View key={doc.id} style={styles.documentItem}>
            <View style={styles.documentInfo}>
              <Ionicons 
                name="document-text" 
                size={20} 
                color={doc.validationStatus === 'approved' ? '#10b981' : doc.validationStatus === 'rejected' ? '#ef4444' : '#f59e0b'} 
              />
              <View style={styles.documentDetails}>
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentType}>{getDocumentTypeName(doc.type)}</Text>
                <Text style={styles.documentSize}>
                  {(doc.size / 1024 / 1024).toFixed(2)} MB - {new Date(doc.uploadedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={[styles.validationBadge, { backgroundColor: getStatusColor(doc.validationStatus as any) }]}>
              <Text style={styles.validationText}>
                {doc.validationStatus === 'approved' ? 'Aprobado' : 
                 doc.validationStatus === 'rejected' ? 'Rechazado' : 'Pendiente'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cartas Instrucción</Text>
        <Text style={styles.subtitle}>
          {user?.role === 'client' ? 'Mis Cartas' : 'Gestión de Documentos'}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por número, cliente o contenedor..."
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
              Todas
            </Text>
          </TouchableOpacity>

          {['draft', 'pending_review', 'approved', 'rejected', 'processing'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                statusFilter === status && styles.filterChipActive,
                { borderColor: getStatusColor(status as InstructionStatus) }
              ]}
              onPress={() => setStatusFilter(status as InstructionStatus)}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === status && styles.filterTextActive
                ]}
              >
                {getStatusName(status as InstructionStatus)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.instructionsContainer}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Nueva Carta Instrucción</Text>
        </TouchableOpacity>

        {getFilteredInstructions().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No se encontraron cartas instrucción</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primera carta instrucción'}
            </Text>
          </View>
        ) : (
          getFilteredInstructions().map(renderInstructionCard)
        )}
      </ScrollView>

      {/* Modal de detalles */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedInstruction?.number}
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedInstruction && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Información General</Text>
                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Estado:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedInstruction.status) }]}>
                        <Text style={styles.statusText}>{getStatusName(selectedInstruction.status)}</Text>
                      </View>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Cliente:</Text>
                      <Text style={styles.detailValue}>{selectedInstruction.clientName}</Text>
                    </View>
                    {selectedInstruction.containerNumber && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Contenedor:</Text>
                        <Text style={styles.detailValue}>{selectedInstruction.containerNumber}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Información del Envío</Text>
                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Origen:</Text>
                      <Text style={styles.detailValue}>{selectedInstruction.shipment.origin}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Destino:</Text>
                      <Text style={styles.detailValue}>{selectedInstruction.shipment.destination}</Text>
                    </View>
                    {selectedInstruction.shipment.vessel && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Buque:</Text>
                        <Text style={styles.detailValue}>{selectedInstruction.shipment.vessel}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Información de la Mercancía</Text>
                  <View style={styles.detailGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Descripción:</Text>
                      <Text style={styles.detailValue}>{selectedInstruction.cargo.description}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Cantidad:</Text>
                      <Text style={styles.detailValue}>{selectedInstruction.cargo.quantity} {selectedInstruction.cargo.unit}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Peso:</Text>
                      <Text style={styles.detailValue}>{selectedInstruction.cargo.weight} kg</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Valor:</Text>
                      <Text style={styles.detailValue}>
                        ${selectedInstruction.cargo.value.toLocaleString()} {selectedInstruction.cargo.currency}
                      </Text>
                    </View>
                  </View>
                </View>

                {renderDocumentsList(selectedInstruction.documents)}

                <View style={styles.actionsSection}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="cloud-upload" size={20} color="#1e3a8a" />
                    <Text style={styles.actionButtonText}>Subir Documentos</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="create" size={20} color="#1e3a8a" />
                    <Text style={styles.actionButtonText}>Editar Carta</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de creación de cartas de instrucción */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Carta Instrucción</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Información del Cliente */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>📋 Información del Cliente</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del Cliente *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ejemplo: Importadora ABC S.A. de C.V."
                  value=""
                  onChangeText={() => {}}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email del Cliente *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="cliente@empresa.com"
                  keyboardType="email-address"
                  value=""
                  onChangeText={() => {}}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de Contenedor *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="TCLU1234567"
                  value=""
                  onChangeText={() => {}}
                />
              </View>
            </View>

            {/* Información del Envío */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>🚢 Información del Envío</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Puerto Origen</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Shanghai, China"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Puerto Destino</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Manzanillo, México"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Buque</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="MSC OSCAR"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Viaje</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="245W"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de BL</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MSCU123456789"
                  value=""
                  onChangeText={() => {}}
                />
              </View>
            </View>

            {/* Información de la Carga */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>📦 Información de la Carga</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descripción de la Carga *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Componentes electrónicos diversos..."
                  multiline
                  numberOfLines={3}
                  value=""
                  onChangeText={() => {}}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Código HS</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="8542.31.00"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Incoterm</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="CIF"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Cantidad</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="500"
                    keyboardType="numeric"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Unidad</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Piezas"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Peso (kg)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="2500"
                    keyboardType="numeric"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Valor (USD)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="45000"
                    keyboardType="numeric"
                    value=""
                    onChangeText={() => {}}
                  />
                </View>
              </View>
            </View>

            {/* Instrucciones Especiales */}
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>📝 Instrucciones Especiales</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Requerimientos Aduanales</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Documentos específicos requeridos, permisos especiales..."
                  multiline
                  numberOfLines={3}
                  value=""
                  onChangeText={() => {}}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notas Adicionales</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Instrucciones especiales para el manejo..."
                  multiline
                  numberOfLines={3}
                  value=""
                  onChangeText={() => {}}
                />
              </View>
            </View>

            {/* Botones de Acción */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={() => {
                  Alert.alert('Éxito', 'Carta de instrucción creada correctamente');
                  setShowCreateModal(false);
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Crear Carta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
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
  instructionsContainer: {
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
  instructionCard: {
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
  instructionInfo: {
    flex: 1,
  },
  instructionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clientName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  containerRef: {
    fontSize: 12,
    color: '#999',
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
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  serviceChip: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  serviceText: {
    fontSize: 12,
    color: '#1e3a8a',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 16,
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
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  documentsSection: {
    marginBottom: 25,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  documentType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  documentSize: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  validationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
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
  // Nuevos estilos para el formulario
  formSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#1e3a8a',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});