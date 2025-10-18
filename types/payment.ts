export type PaymentType = 
  | 'taxes'
  | 'customsAgency'
  | 'commercializationUse'
  | 'appointmentAdvance'
  | 'dispatchFees'
  | 'freight'
  | 'custody'
  | 'demurrage'
  | 'storage'
  | 'handling';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'verified'
  | 'rejected'
  | 'overdue'
  | 'partially_paid';

export interface PaymentItem {
  id: string;
  type: PaymentType;
  description: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  containerId: string;
  containerNumber: string;
  clientId: string;
  clientName: string;
  
  // Receipt information
  receipt?: {
    id: string;
    url: string;
    uploadedAt: string;
    uploadedBy: string;
    fileName: string;
    fileSize: number;
    verifiedBy?: string;
    verifiedAt?: string;
    verificationNotes?: string;
  };

  // Payment details
  paymentMethod?: 'transfer' | 'check' | 'cash' | 'card' | 'other';
  referenceNumber?: string;
  bankAccount?: string;
  
  // Tracking
  statusHistory: {
    status: PaymentStatus;
    date: string;
    notes?: string;
    userId: string;
    userName: string;
  }[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  notes?: string;
  internalNotes?: string;
}

export interface PaymentSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  itemsCount: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  byType: {
    [key in PaymentType]: {
      count: number;
      totalAmount: number;
      paidAmount: number;
    };
  };
}

export interface PaymentTemplate {
  id: string;
  name: string;
  description: string;
  paymentTypes: {
    type: PaymentType;
    defaultAmount?: number;
    isRequired: boolean;
    description: string;
  }[];
  containerTypes?: string[];
  clientTypes?: string[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}