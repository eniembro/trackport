// Configuración oficial de TrackPort
export const APP_CONFIG = {
  // Información oficial de la empresa
  company: {
    name: 'TrackPort',
    website: 'https://www.track-port.com',
    email: 'admin@track-port.com',
    supportEmail: 'servicio@track-port.com',
    salesEmail: 'ventas@track-port.com',
    customsEmail: 'agente@track-port.com',
  },

  // Información de contacto
  contact: {
    phone: '+52 (33) 1234-5678',
    whatsapp: '+52 33 1234 5678',
    address: 'Guadalajara, Jalisco, México',
  },

  // Configuración de la aplicación
  app: {
    name: 'TrackPort',
    version: '1.0.0',
    description: 'Sistema de Gestión de Contenedores y Trámites Aduanales',
    tagline: 'Tu socio confiable en logística internacional',
  },

  // URLs y endpoints
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.track-port.com' 
      : 'http://localhost:3000',
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // Configuración de roles y permisos
  roles: {
    client: {
      name: 'Cliente',
      permissions: ['view_own_containers', 'create_instruction_letters', 'upload_payments'],
    },
    customer_service: {
      name: 'Servicio al Cliente',
      permissions: ['view_all_containers', 'manage_clients', 'validate_documents'],
    },
    customs_broker: {
      name: 'Agente Aduanal',
      permissions: ['view_all_containers', 'upload_customs_documents', 'manage_customs_clearance'],
    },
    sales: {
      name: 'Ventas',
      permissions: ['manage_clients', 'view_reports', 'configure_rates'],
    },
    main_admin: {
      name: 'Administrador Principal',
      permissions: ['full_access', 'manage_users', 'system_configuration', 'view_all_reports'],
    },
  },

  // Estados de contenedores (15 etapas)
  containerStatuses: [
    { key: 'arrival_date', name: 'Fecha de Llegada', color: '#1e3a8a' },
    { key: 'preview_date', name: 'Fecha de Previo', color: '#1e3a8a' },
    { key: 'proforma_uploaded', name: 'Proforma Subida', color: '#FF9500' },
    { key: 'taxes_paid', name: 'Impuestos Pagados', color: '#34C759' },
    { key: 'pedimento_uploaded', name: 'Pedimento Subido', color: '#FF9500' },
    { key: 'demurrage_paid', name: 'Demora Pagada', color: '#34C759' },
    { key: 'storage_paid', name: 'Almacenaje Pagado', color: '#34C759' },
    { key: 'handling_paid', name: 'Maniobras Pagadas', color: '#34C759' },
    { key: 'appointment_scheduled', name: 'Cita Programada', color: '#5856D6' },
    { key: 'appointment_advanced', name: 'Cita Adelantada', color: '#5856D6' },
    { key: 'dispatch_fees_paid', name: 'Despacho Pagado', color: '#34C759' },
    { key: 'transport_paid', name: 'Transporte Pagado', color: '#34C759' },
    { key: 'custody_paid', name: 'Custodia Pagada', color: '#34C759' },
    { key: 'red_inspection', name: 'Reconocimiento Rojo', color: '#FF3B30' },
    { key: 'container_released', name: 'Contenedor Liberado', color: '#00C896' },
  ],

  // Tipos de pago (10 tipos)
  paymentTypes: [
    { key: 'taxes', name: 'Impuestos' },
    { key: 'customsAgency', name: 'Agencia Aduanal' },
    { key: 'commercializationUse', name: 'Uso de Comercialización' },
    { key: 'appointmentAdvance', name: 'Adelanto de Cita' },
    { key: 'dispatchFees', name: 'Gastos de Despacho' },
    { key: 'freight', name: 'Flete' },
    { key: 'custody', name: 'Custodia' },
    { key: 'demurrage', name: 'Demora' },
    { key: 'storage', name: 'Almacenaje' },
    { key: 'handling', name: 'Maniobras' },
  ],

  // Colores del tema (basados en el logo oficial)
  theme: {
    primary: '#1e3a8a', // Azul principal del logo
    primaryLight: '#3b82f6', // Azul secundario del logo
    secondary: '#5856D6',
    accent: '#93c5fd', // Azul claro del contenedor en el logo
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    containerBlue: '#93c5fd', // Color específico del contenedor
    craneBlue: '#1e3a8a', // Color específico de la grúa
  },
};