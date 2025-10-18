export type ContainerStatus = 
  | 'arrival_date'
  | 'preview_date'
  | 'proforma_uploaded'
  | 'customs_validation'
  | 'taxes_calculated'
  | 'taxes_paid'
  | 'mechanical_validation'
  | 'customs_inspection'
  | 'payment_validation'
  | 'customs_dispatch'
  | 'container_pickup'
  | 'container_loading'
  | 'container_released'
  | 'delivery_requested'
  | 'delivery_completed';

export interface StatusHistoryItem {
  status: ContainerStatus;
  date: string;
  notes?: string;
  amount?: number;
  documentUrl?: string;
  userId?: string;
  userName?: string;
}

export interface Container {
  id: string;
  number: string;
  status: ContainerStatus;
  arrivalDate?: string;
  previewDate?: string;
  currentLocation?: string;
  size?: '20' | '40' | '45';
  type?: 'dry' | 'refrigerated' | 'open_top' | 'flat_rack';
  weight?: number;
  seal?: string;
  statusHistory: StatusHistoryItem[];
  instructionLetter?: {
    id: string;
    clientId: string;
    clientName: string;
    documentUrl?: string;
  };
  documents?: {
    id: string;
    type: string;
    name: string;
    url: string;
    uploadedAt: string;
    uploadedBy: string;
  }[];
  payments?: {
    id: string;
    type: string;
    amount: number;
    status: 'pending' | 'paid' | 'verified';
    dueDate?: string;
    paidDate?: string;
    receiptUrl?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  assignedTo?: string;
}