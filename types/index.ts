// User and Authentication Types
export type UserRole = 'client' | 'customer_service' | 'customs_broker' | 'sales' | 'main_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clientId?: string;
  phone?: string;
  whatsappNumbers?: string[];
  createdAt: string;
}

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
  file: DocumentFile;
  uploadedAt: string;
  notes?: string;
}

export interface InstructionLetter {
  id: string;
  clientId: string;
  containerNumber: string;
  merchandiseType: MerchandiseType;
  serviceType: ServiceType;
  transport: TransportOptions;
  appointmentAdvance: {
    authorized: boolean;
    cost?: number;
  };
  documents: {
    invoice?: DocumentFile;
    billOfLading?: DocumentFile;
    packingList?: DocumentFile;
  };
  customsAgent?: {
    name: string;
    patentNumber: string;
  };
  additionalRequests?: string;
  status: 'draft' | 'submitted' | 'processing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Container {
  id: string;
  containerNumber: string;
  clientId: string;
  instructionLetterId?: string;
  port: 'lazaro_cardenas' | 'manzanillo';
  currentStatus: ContainerStatus;
  statusHistory: StatusUpdate[];
  merchandiseType: MerchandiseType;
  tariffCode?: string;
  patent?: string;
  costs: {
    taxes: number;
    customsAgency: number;
    commercializationUse: number;
    appointmentAdvance: number;
    dispatchFees: number;
    freight: number;
    custody: number;
    demurrage: number;
    storage: number;
    handling: number;
    advisoryFee: number;
  };
  documents: {
    proforma?: DocumentFile;
    pedimento?: DocumentFile;
    invoice?: DocumentFile;
    exitReport?: DocumentFile;
  };
  paymentReceipts?: PaymentReceipt[];
  createdAt: string;
  updatedAt: string;
}

// Rate and Pricing Types
export interface MerchandiseRates {
  taxesMin: number;
  taxesMax: number;
  dispatchFeesMin: number;
  dispatchFeesMax: number;
}

export interface AdditionalServiceRates {
  appointmentAdvance: number;
  transport: number;
  custody: number;
  armedCustody: number;
}

export interface ClientRates {
  clientId: string;
  merchandiseRates: { [key in MerchandiseType]: MerchandiseRates };
  additionalServices: AdditionalServiceRates;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}