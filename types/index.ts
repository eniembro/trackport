// Core types for the TrackPort application
export type UserRole = 'client' | 'customer_service' | 'customs_broker' | 'sales' | 'main_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  company?: string;
  clientId?: string; // For linking clients to their containers
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Re-export all types
export * from './container';
export * from './instruction';
export * from './payment';
export * from './reports';

// Container and Instruction Types
export type MerchandiseType = 'textiles' | 'own_brand_clothing' | 'footwear' | 'electronics' | 'automotive_parts' | 'home_goods' | 'toys' | 'cosmetics' | 'food_products' | 'industrial_supplies' | 'raw_materials' | 'other';

export type ServiceType = 'advisory' | 'agency_client_broker' | 'agency_our_broker';

export type ContainerStatus = 
  | 'arrival_date' | 'preview_date' | 'proforma_uploaded' | 'taxes_paid' 
  | 'pedimento_uploaded' | 'demurrage_paid' | 'storage_paid' | 'handling_paid' 
  | 'appointment_scheduled' | 'appointment_advanced' | 'dispatch_fees_paid' 
  | 'transport_paid' | 'custody_paid' | 'red_inspection' | 'container_released';

export type PaymentType = 'taxes' | 'customsAgency' | 'commercializationUse' | 'appointmentAdvance' | 'dispatchFees' | 'freight' | 'custody' | 'demurrage' | 'storage' | 'handling';

export interface DocumentFile {
  id: string;
  name: string;
  uri: string;
  type: string;
  uploadedAt: string;
}

export interface TransportOptions {
  required: boolean;
  custody: boolean;
  armedCustody: boolean;
}

export interface StatusUpdate {
  status: ContainerStatus;
  date: string;
  notes?: string;
  amount?: number;
}

export interface PaymentReceipt {
  id: string;
  type: PaymentType;
  amount: number;
  date: string;
  receiptUrl?: string;
  notes?: string;
}

export interface Container {
  id: string;
  number: string;
  instructionLetter?: {
    id: string;
    clientId: string;
    clientName: string;
    documentUrl?: string;
  };
  status: ContainerStatus;
  arrivalDate?: string;
  previewDate?: string;
  currentLocation?: string;
  statusHistory: StatusUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalContainers: number;
  activeContainers: number;
  pendingPayments: number;
  completedContainers: number;
  monthlyRevenue: number;
  pendingInstructions: number;
}