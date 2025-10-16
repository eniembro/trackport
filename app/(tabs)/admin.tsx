import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminService, CreateUserData, SystemModule, ModulePermission } from '../../src/lib/adminService';
import { CredentialNotificationService } from '../../src/lib/credentialNotificationService';

interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  modules: Array<{
    module_name: string;
    module_display_name: string;
    role: string;
    department?: string;
    permissions: string[];
  }>;
  notification_data?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    preferred_method: 'email' | 'whatsapp' | 'sms';
  };
  last_login?: string;
  is_active: boolean;
}

export default function AdminScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [selectedModulePermissions, setSelectedModulePermissions] = useState<ModulePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableNotificationMethods, setAvailableNotificationMethods] = useState({
    email: true, // Siempre disponible por defecto
    whatsapp: false,
    sms: false
  });

  // Form state para crear usuario
  const [newUser, setNewUser] = useState<CreateUserData>({
    email: '',
    username: '',
    full_name: '',
    module: '',
    role: 'user',
    department: '',
    permissions: [],
    notification_data: {
      email: '',
      phone: '',
      whatsapp: '',
      preferred_method: 'email'
    }
  });

  // Módulos simulados para el demo
  const demoModules: SystemModule[] = [
    { id: '1', name: 'CLIENTE', display_name: 'Gestión de Clientes', description: 'Módulo para administración de clientes', is_active: true, created_at: '', updated_at: '' },
    { id: '2', name: 'VENTAS', display_name: 'Ventas y Cotizaciones', description: 'Módulo para gestión de ventas', is_active: true, created_at: '', updated_at: '' },
    { id: '3', name: 'SAC', display_name: 'Servicio al Cliente', description: 'Módulo para atención al cliente', is_active: true, created_at: '', updated_at: '' },
    { id: '4', name: 'A_ADUANAL', display_name: 'Agencia Aduanal', description: 'Módulo para trámites aduanales', is_active: true, created_at: '', updated_at: '' },
    { id: '5', name: 'ADMIN', display_name: 'Administración', description: 'Módulo de administración', is_active: true, created_at: '', updated_at: '' }
  ];

  useEffect(() => {
    loadData();
    checkNotificationMethods();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Usar módulos demo por ahora
      setModules(demoModules);
      setUsers([]); // Array vacío para empezar
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const checkNotificationMethods = async () => {
    try {
      const methods = await CredentialNotificationService.getAvailableNotificationMethods();
      setAvailableNotificationMethods(methods);
    } catch (error) {
      console.error('Error checking notification methods:', error);
      // Mantener valores por defecto
    }
  };

  const handleModuleChange = async (moduleName: string) => {
    setNewUser(prev => ({ ...prev, module: moduleName, permissions: [] }));
    
    // Permisos demo basados en el módulo
    const demoPermissions: ModulePermission[] = [
      { id: '1', module_id: '1', permission_code: 'view', permission_name: 'Ver', description: 'Ver información', is_active: true, created_at: '' },
      { id: '2', module_id: '1', permission_code: 'create', permission_name: 'Crear', description: 'Crear registros', is_active: true, created_at: '' },
      { id: '3', module_id: '1', permission_code: 'edit', permission_name: 'Editar', description: 'Editar información', is_active: true, created_at: '' },
      { id: '4', module_id: '1', permission_code: 'delete', permission_name: 'Eliminar', description: 'Eliminar registros', is_active: true, created_at: '' }
    ];
    
    setSelectedModulePermissions(demoPermissions);
  };

  const togglePermission = (permissionCode: string) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions?.includes(permissionCode)
        ? prev.permissions.filter(p => p !== permissionCode)
        : [...(prev.permissions || []), permissionCode]
    }));
  };

  const validateForm = (): boolean => {
    if (!newUser.email || !CredentialNotificationService.validateEmail(newUser.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    if (!newUser.module) {
      Alert.alert('Error', 'Por favor selecciona un módulo');
      return false;
    }

    if (!newUser.full_name?.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre completo');
      return false;
    }

    return true;
  };

  const createUser = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Simular creación exitosa
      Alert.alert(
        'Usuario Creado', 
        `Usuario ${newUser.full_name} creado exitosamente para el módulo ${newUser.module}.\n\nEn producción, las credenciales se enviarían por ${newUser.notification_data.preferred_method}.`
      );
      
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewUser({
      email: '',
      username: '',
      full_name: '',
      module: '',
      role: 'user',
      department: '',
      permissions: [],
      notification_data: {
        email: '',
        phone: '',
        whatsapp: '',
        preferred_method: 'email'
      }
    });
    setSelectedModulePermissions([]);
  };

  const renderUserCard = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.full_name || item.username || 'Sin nombre'}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
      
      {item.modules.map((module, index) => (
        <View key={index} style={styles.moduleInfo}>
          <Text style={styles.moduleName}>📋 {module.module_display_name}</Text>
          <Text style={styles.moduleRole}>👤 {module.role}</Text>
          {module.department && (
            <Text style={styles.moduleDepartment}>🏛️ {module.department}</Text>
          )}
          <Text style={styles.modulePermissions}>
            🔑 {module.permissions.length} permisos
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Sistema de Gestión de Usuarios por Módulos</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Usuarios</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{modules.length}</Text>
          <Text style={styles.statLabel}>Módulos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Departamentos</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.createButtonText}>➕ Crear Usuario</Text>
      </TouchableOpacity>

      {users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>🏢 Sistema de Módulos Empresariales</Text>
          <Text style={styles.emptyText}>
            Este sistema permite crear usuarios con acceso específico a diferentes módulos:
          </Text>
          <View style={styles.moduleList}>
            {demoModules.map((module) => (
              <Text key={module.id} style={styles.moduleListItem}>
                • {module.display_name}
              </Text>
            ))}
          </View>
          <Text style={styles.emptySubtext}>
            Cada usuario puede tener roles específicos y permisos granulares por módulo.
            Las credenciales se envían automáticamente por email o WhatsApp.
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          style={styles.userList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de creación de usuario */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crear Nuevo Usuario</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              <Text style={styles.closeButtonText}>❌</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Información básica */}
            <Text style={styles.sectionTitle}>👤 Información Personal</Text>
            
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={styles.input}
              value={newUser.full_name}
              onChangeText={(text) => setNewUser(prev => ({ ...prev, full_name: text }))}
              placeholder="Ej: Juan Pérez García"
            />

            <Text style={styles.label}>Nombre de Usuario</Text>
            <TextInput
              style={styles.input}
              value={newUser.username}
              onChangeText={(text) => setNewUser(prev => ({ ...prev, username: text }))}
              placeholder="Ej: jperez"
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={newUser.email}
              onChangeText={(text) => setNewUser(prev => ({ ...prev, email: text }))}
              placeholder="usuario@empresa.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Módulo y rol */}
            <Text style={styles.sectionTitle}>🏢 Asignación de Módulo</Text>
            
            <Text style={styles.label}>Módulo *</Text>
            <ScrollView horizontal style={styles.moduleSelector} showsHorizontalScrollIndicator={false}>
              {modules.map((module) => (
                <TouchableOpacity
                  key={module.id}
                  style={[
                    styles.moduleOption,
                    newUser.module === module.name && styles.moduleOptionSelected
                  ]}
                  onPress={() => handleModuleChange(module.name)}
                >
                  <Text style={[
                    styles.moduleOptionText,
                    newUser.module === module.name && styles.moduleOptionTextSelected
                  ]}>
                    {module.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Rol</Text>
            <View style={styles.roleSelector}>
              {['user', 'supervisor', 'operator', 'admin'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    newUser.role === role && styles.roleOptionSelected
                  ]}
                  onPress={() => setNewUser(prev => ({ ...prev, role: role as any }))}
                >
                  <Text style={[
                    styles.roleOptionText,
                    newUser.role === role && styles.roleOptionTextSelected
                  ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Departamento</Text>
            <TextInput
              style={styles.input}
              value={newUser.department}
              onChangeText={(text) => setNewUser(prev => ({ ...prev, department: text }))}
              placeholder="Ej: Ventas Nacionales"
            />

            {/* Permisos */}
            {selectedModulePermissions.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>🔑 Permisos del Módulo</Text>
                {selectedModulePermissions.map((permission) => (
                  <View key={permission.id} style={styles.permissionItem}>
                    <View style={styles.permissionInfo}>
                      <Text style={styles.permissionName}>{permission.permission_name}</Text>
                      <Text style={styles.permissionDescription}>{permission.description}</Text>
                    </View>
                    <Switch
                      value={newUser.permissions?.includes(permission.permission_code) || false}
                      onValueChange={() => togglePermission(permission.permission_code)}
                    />
                  </View>
                ))}
              </>
            )}

            {/* Notificaciones */}
            <Text style={styles.sectionTitle}>📱 Método de Notificación</Text>
            
            <View style={styles.notificationMethodSelector}>
              <TouchableOpacity
                style={[
                  styles.notificationMethod,
                  newUser.notification_data.preferred_method === 'email' && styles.notificationMethodSelected
                ]}
                onPress={() => setNewUser(prev => ({
                  ...prev,
                  notification_data: { ...prev.notification_data, preferred_method: 'email' }
                }))}
              >
                <Text style={styles.notificationMethodText}>📧 Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.notificationMethod,
                  newUser.notification_data.preferred_method === 'whatsapp' && styles.notificationMethodSelected
                ]}
                onPress={() => setNewUser(prev => ({
                  ...prev,
                  notification_data: { ...prev.notification_data, preferred_method: 'whatsapp' }
                }))}
              >
                <Text style={styles.notificationMethodText}>💬 WhatsApp</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.notificationMethod,
                  newUser.notification_data.preferred_method === 'sms' && styles.notificationMethodSelected
                ]}
                onPress={() => setNewUser(prev => ({
                  ...prev,
                  notification_data: { ...prev.notification_data, preferred_method: 'sms' }
                }))}
              >
                <Text style={styles.notificationMethodText}>📱 SMS</Text>
              </TouchableOpacity>
            </View>

            {/* Campos específicos del método de notificación */}
            {newUser.notification_data.preferred_method === 'email' && (
              <>
                <Text style={styles.label}>Email para notificaciones *</Text>
                <TextInput
                  style={styles.input}
                  value={newUser.notification_data.email}
                  onChangeText={(text) => setNewUser(prev => ({
                    ...prev,
                    notification_data: { ...prev.notification_data, email: text }
                  }))}
                  placeholder="notificaciones@empresa.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
            )}

            {newUser.notification_data.preferred_method === 'whatsapp' && (
              <>
                <Text style={styles.label}>WhatsApp *</Text>
                <TextInput
                  style={styles.input}
                  value={newUser.notification_data.whatsapp}
                  onChangeText={(text) => setNewUser(prev => ({
                    ...prev,
                    notification_data: { ...prev.notification_data, whatsapp: text }
                  }))}
                  placeholder="+52 33 1234 5678"
                  keyboardType="phone-pad"
                />
              </>
            )}

            {newUser.notification_data.preferred_method === 'sms' && (
              <>
                <Text style={styles.label}>Teléfono *</Text>
                <TextInput
                  style={styles.input}
                  value={newUser.notification_data.phone}
                  onChangeText={(text) => setNewUser(prev => ({
                    ...prev,
                    notification_data: { ...prev.notification_data, phone: text }
                  }))}
                  placeholder="+52 33 1234 5678"
                  keyboardType="phone-pad"
                />
              </>
            )}

            <TouchableOpacity
              style={styles.createUserButton}
              onPress={createUser}
              disabled={loading}
            >
              <Text style={styles.createUserButtonText}>
                {loading ? 'Creando...' : '✅ Crear Usuario y Enviar Credenciales'}
              </Text>
            </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  moduleList: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  moduleListItem: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  userList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  moduleInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  moduleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  moduleRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moduleDepartment: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modulePermissions: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  moduleSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  moduleOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  moduleOptionSelected: {
    backgroundColor: '#007AFF',
  },
  moduleOptionText: {
    fontSize: 14,
    color: '#333',
  },
  moduleOptionTextSelected: {
    color: '#fff',
  },
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  roleOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  roleOptionSelected: {
    backgroundColor: '#007AFF',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#333',
  },
  roleOptionTextSelected: {
    color: '#fff',
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 12,
  },
  permissionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  permissionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  notificationMethodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  notificationMethod: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  notificationMethodSelected: {
    backgroundColor: '#34c759',
  },
  notificationMethodText: {
    fontSize: 14,
    color: '#333',
  },
  createUserButton: {
    backgroundColor: '#34c759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  createUserButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});