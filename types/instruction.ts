export type InstructionStatus = 
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'requires_changes'
  | 'processing'
  | 'completed';

export interface InstructionDocument {
  id: string;
  type: 'commercial_invoice' | 'packing_list' | 'bill_of_lading' | 'certificate_origin' | 'other';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  isRequired: boolean;
  validationStatus: 'pending' | 'approved' | 'rejected';
  validationNotes?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export interface InstructionLetter {
  id: string;
  number: string; // CI-2024-001
  clientId: string;
  clientName: string;
  clientEmail: string;
  containerNumber?: string;
  containerId?: string;
  status: InstructionStatus;
  
  // Información del envío
  shipment: {
    origin: string;
    destination: string;
    shipmentDate?: string;
    estimatedArrival?: string;
    vessel?: string;
    voyage?: string;
    bl_number?: string;
  };

  // Información de la mercancía
  cargo: {
    description: string;
    hsCode?: string;
    quantity: number;
    unit: string;
    weight: number;
    value: number;
    currency: string;
    incoterm?: string;
  };

  // Documentos
  documents: InstructionDocument[];
  requiredDocuments: string[];
  
  // Servicios solicitados
  services: {
    customsClearance: boolean;
    transportation: boolean;
    insurance: boolean;
    storage: boolean;
    inspection: boolean;
    other?: string[];
  };

  // Información de contacto especial
  contacts: {
    consignee?: {
      name: string;
      address: string;
      phone?: string;
      email?: string;
    };
    notifyParty?: {
      name: string;
      address: string;
      phone?: string;
      email?: string;
    };
  };

  // Historial y seguimiento
  statusHistory: {
    status: InstructionStatus;
    date: string;
    notes?: string;
    userId: string;
    userName: string;
  }[];

  // Comentarios y observaciones
  notes?: string;
  internalNotes?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface InstructionTemplate {
  id: string;
  name: string;
  description: string;
  requiredDocuments: string[];
  defaultServices: Partial<InstructionLetter['services']>;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}