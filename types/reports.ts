// Tipos para el sistema de reportes y exportación

export interface ReportFilter {
  dateRange: {
    from: string;
    to: string;
  };
  status?: string[];
  clientId?: string;
  role?: string;
  paymentType?: string[];
  priority?: string[];
}

export interface ReportMetrics {
  totalContainers: number;
  activeContainers: number;
  completedContainers: number;
  pendingPayments: number;
  totalRevenue: number;
  averageProcessingTime: number;
  clientCount: number;
  instructionCount: number;
}

export interface ContainerReport {
  id: string;
  number: string;
  client: string;
  status: string;
  arrivalDate: string;
  completionDate?: string;
  processingDays: number;
  totalPayments: number;
  pendingPayments: number;
}

export interface PaymentReport {
  id: string;
  containerNumber: string;
  client: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paidDate?: string;
  daysOverdue: number;
}

export interface InstructionReport {
  id: string;
  title: string;
  containerNumber: string;
  client: string;
  status: string;
  priority: string;
  createdDate: string;
  completedDate?: string;
  processingDays: number;
  documentCount: number;
}

export interface ClientReport {
  id: string;
  name: string;
  email: string;
  company?: string;
  totalContainers: number;
  activeContainers: number;
  totalPayments: number;
  pendingPayments: number;
  lastActivity: string;
}

export interface RevenueReport {
  period: string;
  totalRevenue: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  transactionCount: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface ReportData {
  metrics: ReportMetrics;
  containers: ContainerReport[];
  payments: PaymentReport[];
  instructions: InstructionReport[];
  clients: ClientReport[];
  revenue: RevenueReport[];
  statusDistribution: StatusDistribution[];
  generatedAt: string;
  filter: ReportFilter;
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  includeCharts: boolean;
  includeDetails: boolean;
  fileName?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

export type ReportType = 
  | 'overview' 
  | 'containers' 
  | 'payments' 
  | 'instructions' 
  | 'clients' 
  | 'revenue' 
  | 'performance';

export interface ReportConfig {
  type: ReportType;
  title: string;
  description: string;
  icon: string;
  requiredRole: string[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'progress';
  value?: number | string;
  change?: number;
  chartData?: ChartData;
  items?: any[];
  color: string;
  icon: string;
}