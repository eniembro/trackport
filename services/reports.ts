import * as XLSX from 'xlsx';
import { 
  ReportData, 
  ReportFilter, 
  ReportMetrics, 
  ContainerReport, 
  PaymentReport, 
  InstructionReport, 
  ClientReport,
  ExportOptions,
  RevenueReport,
  StatusDistribution,
  DashboardWidget,
  ChartData
} from '../types/reports';
import { supabase, containers, payments, instructionLetters } from './supabase';

class ReportsService {
  
  // Generar reporte completo
  async generateReport(filter: ReportFilter): Promise<ReportData> {
    try {
      const [
        containersData,
        paymentsData,
        instructionsData,
        clientsData
      ] = await Promise.all([
        this.getContainerReports(filter),
        this.getPaymentReports(filter),
        this.getInstructionReports(filter),
        this.getClientReports(filter)
      ]);

      const metrics = this.calculateMetrics(containersData, paymentsData, instructionsData, clientsData);
      const revenue = this.calculateRevenue(paymentsData, filter);
      const statusDistribution = this.calculateStatusDistribution(containersData);

      return {
        metrics,
        containers: containersData,
        payments: paymentsData,
        instructions: instructionsData,
        clients: clientsData,
        revenue,
        statusDistribution,
        generatedAt: new Date().toISOString(),
        filter
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Error al generar el reporte');
    }
  }

  // Obtener reportes de contenedores
  async getContainerReports(filter: ReportFilter): Promise<ContainerReport[]> {
    try {
      const { data, error } = await supabase
        .from('containers')
        .select(`
          id, number, status, arrival_date, created_at, updated_at,
          client:users!containers_client_id_fkey(name, company),
          payments(amount, status)
        `)
        .gte('created_at', filter.dateRange.from)
        .lte('created_at', filter.dateRange.to);

      if (error) throw error;

      return data?.map(container => {
        const totalPayments = container.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
        const pendingPayments = container.payments?.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
        const processingDays = this.calculateProcessingDays(container.created_at, container.updated_at);
        const clientInfo = Array.isArray(container.client) ? container.client[0] : container.client;

        return {
          id: container.id,
          number: container.number,
          client: clientInfo?.company || clientInfo?.name || 'N/A',
          status: container.status,
          arrivalDate: container.arrival_date || container.created_at,
          completionDate: container.status === 'delivered' ? container.updated_at : undefined,
          processingDays,
          totalPayments,
          pendingPayments
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching container reports:', error);
      return [];
    }
  }

  // Obtener reportes de pagos
  async getPaymentReports(filter: ReportFilter): Promise<PaymentReport[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id, type, amount, currency, status, due_date, paid_date, created_at,
          container:containers!payments_container_id_fkey(number),
          client:users!payments_client_id_fkey(name, company)
        `)
        .gte('created_at', filter.dateRange.from)
        .lte('created_at', filter.dateRange.to);

      if (error) throw error;

      return data?.map(payment => {
        const daysOverdue = payment.status === 'overdue' 
          ? this.calculateDaysOverdue(payment.due_date) 
          : 0;
        const containerInfo = Array.isArray(payment.container) ? payment.container[0] : payment.container;
        const clientInfo = Array.isArray(payment.client) ? payment.client[0] : payment.client;

        return {
          id: payment.id,
          containerNumber: containerInfo?.number || 'N/A',
          client: clientInfo?.company || clientInfo?.name || 'N/A',
          type: payment.type,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          dueDate: payment.due_date,
          paidDate: payment.paid_date,
          daysOverdue
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching payment reports:', error);
      return [];
    }
  }

  // Obtener reportes de instrucciones
  async getInstructionReports(filter: ReportFilter): Promise<InstructionReport[]> {
    try {
      const { data, error } = await supabase
        .from('instruction_letters')
        .select(`
          id, title, status, priority, created_at, updated_at,
          container:containers!instruction_letters_container_id_fkey(number),
          client:users!instruction_letters_client_id_fkey(name, company),
          documents:instruction_documents(id)
        `)
        .gte('created_at', filter.dateRange.from)
        .lte('created_at', filter.dateRange.to);

      if (error) throw error;

      return data?.map(instruction => {
        const processingDays = this.calculateProcessingDays(instruction.created_at, instruction.updated_at);
        const containerInfo = Array.isArray(instruction.container) ? instruction.container[0] : instruction.container;
        const clientInfo = Array.isArray(instruction.client) ? instruction.client[0] : instruction.client;

        return {
          id: instruction.id,
          title: instruction.title,
          containerNumber: containerInfo?.number || 'N/A',
          client: clientInfo?.company || clientInfo?.name || 'N/A',
          status: instruction.status,
          priority: instruction.priority,
          createdDate: instruction.created_at,
          completedDate: instruction.status === 'completed' ? instruction.updated_at : undefined,
          processingDays,
          documentCount: instruction.documents?.length || 0
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching instruction reports:', error);
      return [];
    }
  }

  // Obtener reportes de clientes
  async getClientReports(filter: ReportFilter): Promise<ClientReport[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, name, email, company, created_at, updated_at,
          containers(id, status),
          payments(amount, status)
        `)
        .eq('role', 'client');

      if (error) throw error;

      return data?.map(client => {
        const totalContainers = client.containers?.length || 0;
        const activeContainers = client.containers?.filter(c => !['delivered', 'archived'].includes(c.status)).length || 0;
        const totalPayments = client.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        const pendingPayments = client.payments?.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0) || 0;

        return {
          id: client.id,
          name: client.name,
          email: client.email,
          company: client.company,
          totalContainers,
          activeContainers,
          totalPayments,
          pendingPayments,
          lastActivity: client.updated_at
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching client reports:', error);
      return [];
    }
  }

  // Calcular métricas generales
  calculateMetrics(
    containers: ContainerReport[], 
    payments: PaymentReport[], 
    instructions: InstructionReport[],
    clients: ClientReport[]
  ): ReportMetrics {
    const totalContainers = containers.length;
    const activeContainers = containers.filter(c => !['delivered', 'archived'].includes(c.status)).length;
    const completedContainers = containers.filter(c => c.status === 'delivered').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const averageProcessingTime = containers.reduce((sum, c) => sum + c.processingDays, 0) / containers.length || 0;

    return {
      totalContainers,
      activeContainers,
      completedContainers,
      pendingPayments,
      totalRevenue,
      averageProcessingTime: Math.round(averageProcessingTime),
      clientCount: clients.length,
      instructionCount: instructions.length
    };
  }

  // Calcular reporte de ingresos
  calculateRevenue(payments: PaymentReport[], filter: ReportFilter): RevenueReport[] {
    const monthlyRevenue: { [key: string]: RevenueReport } = {};

    payments.forEach(payment => {
      const month = payment.dueDate.substring(0, 7); // YYYY-MM
      
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = {
          period: month,
          totalRevenue: 0,
          paidAmount: 0,
          pendingAmount: 0,
          overdueAmount: 0,
          transactionCount: 0
        };
      }

      monthlyRevenue[month].totalRevenue += payment.amount;
      monthlyRevenue[month].transactionCount++;

      if (payment.status === 'paid') {
        monthlyRevenue[month].paidAmount += payment.amount;
      } else if (payment.status === 'pending') {
        monthlyRevenue[month].pendingAmount += payment.amount;
      } else if (payment.status === 'overdue') {
        monthlyRevenue[month].overdueAmount += payment.amount;
      }
    });

    return Object.values(monthlyRevenue).sort((a, b) => a.period.localeCompare(b.period));
  }

  // Calcular distribución de estados
  calculateStatusDistribution(containers: ContainerReport[]): StatusDistribution[] {
    const statusCount: { [key: string]: number } = {};
    const total = containers.length;

    containers.forEach(container => {
      statusCount[container.status] = (statusCount[container.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }

  // Exportar a Excel (simplificado)
  async exportToExcel(reportData: ReportData, options: ExportOptions = { format: 'excel', includeCharts: false, includeDetails: true }): Promise<string> {
    try {
      const workbook = XLSX.utils.book_new();

      // Hoja de resumen
      const summaryData = [
        ['TrackPort - Reporte Ejecutivo', ''],
        ['Generado el:', new Date(reportData.generatedAt).toLocaleDateString()],
        ['Período:', `${reportData.filter.dateRange.from} - ${reportData.filter.dateRange.to}`],
        [''],
        ['MÉTRICAS GENERALES', ''],
        ['Total de Contenedores', reportData.metrics.totalContainers],
        ['Contenedores Activos', reportData.metrics.activeContainers],
        ['Contenedores Completados', reportData.metrics.completedContainers],
        ['Pagos Pendientes', reportData.metrics.pendingPayments],
        ['Ingresos Totales', `$${reportData.metrics.totalRevenue.toLocaleString()}`],
        ['Tiempo Promedio de Procesamiento', `${reportData.metrics.averageProcessingTime} días`],
        ['Total de Clientes', reportData.metrics.clientCount],
        ['Total de Instrucciones', reportData.metrics.instructionCount],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

      // Hoja de contenedores
      if (options.includeDetails) {
        const containerSheet = XLSX.utils.json_to_sheet(reportData.containers);
        XLSX.utils.book_append_sheet(workbook, containerSheet, 'Contenedores');

        // Hoja de pagos
        const paymentSheet = XLSX.utils.json_to_sheet(reportData.payments);
        XLSX.utils.book_append_sheet(workbook, paymentSheet, 'Pagos');

        // Hoja de instrucciones
        const instructionSheet = XLSX.utils.json_to_sheet(reportData.instructions);
        XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instrucciones');

        // Hoja de clientes
        const clientSheet = XLSX.utils.json_to_sheet(reportData.clients);
        XLSX.utils.book_append_sheet(workbook, clientSheet, 'Clientes');
      }

      // Generar archivo como base64 string
      const fileName = options.fileName || `TrackPort_Reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      
      // Por ahora retornar el contenido base64
      console.log('Reporte Excel generado:', fileName);
      return wbout;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Error al exportar a Excel');
    }
  }

  // Compartir reporte (simplificado)
  async shareReport(content: string, fileName: string = 'reporte.xlsx'): Promise<void> {
    try {
      // Por ahora solo log, implementar sharing después
      console.log('Compartiendo reporte:', fileName);
      console.log('Contenido generado:', content.substring(0, 100) + '...');
    } catch (error) {
      console.error('Error sharing report:', error);
      throw new Error('Error al compartir el reporte');
    }
  }

  // Widgets para dashboard
  async getDashboardWidgets(userId: string, userRole: string): Promise<DashboardWidget[]> {
    const filter: ReportFilter = {
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
        to: new Date().toISOString()
      }
    };

    const reportData = await this.generateReport(filter);

    const widgets: DashboardWidget[] = [
      {
        id: 'total-containers',
        title: 'Total Contenedores',
        type: 'metric',
        value: reportData.metrics.totalContainers,
        change: 12, // Porcentaje de cambio
        color: '#3b82f6',
        icon: 'cube'
      },
      {
        id: 'pending-payments',
        title: 'Pagos Pendientes',
        type: 'metric',
        value: reportData.metrics.pendingPayments,
        change: -5,
        color: '#ef4444',
        icon: 'card'
      },
      {
        id: 'revenue',
        title: 'Ingresos del Mes',
        type: 'metric',
        value: `$${reportData.metrics.totalRevenue.toLocaleString()}`,
        change: 8,
        color: '#10b981',
        icon: 'trending-up'
      },
      {
        id: 'processing-time',
        title: 'Tiempo Promedio',
        type: 'metric',
        value: `${reportData.metrics.averageProcessingTime} días`,
        change: -2,
        color: '#8b5cf6',
        icon: 'time'
      }
    ];

    // Agregar gráfico de estado solo para roles administrativos
    if (['main_admin', 'customer_service', 'sales'].includes(userRole)) {
      widgets.push({
        id: 'status-chart',
        title: 'Distribución de Estados',
        type: 'chart',
        chartData: {
          labels: reportData.statusDistribution.map(s => s.status),
          datasets: [{
            label: 'Contenedores',
            data: reportData.statusDistribution.map(s => s.count),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
          }]
        },
        color: '#3b82f6',
        icon: 'analytics'
      });
    }

    return widgets;
  }

  // Funciones auxiliares
  private calculateProcessingDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private calculateDaysOverdue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    return Math.max(0, Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
  }
}

export const reportsService = new ReportsService();
export default reportsService;