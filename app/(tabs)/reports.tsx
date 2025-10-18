import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { reportsService } from '../../services/reports';
import { ReportData, ReportFilter, DashboardWidget, ReportType } from '../../types/reports';

export default function Reports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportType>('overview');
  
  const [filter, setFilter] = useState<ReportFilter>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    }
  });

  const reportTypes = [
    { type: 'overview' as ReportType, title: 'Resumen General', icon: 'analytics', requiredRole: ['main_admin', 'sales', 'customer_service'] },
    { type: 'containers' as ReportType, title: 'Contenedores', icon: 'cube', requiredRole: ['main_admin', 'customer_service', 'customs_broker'] },
    { type: 'payments' as ReportType, title: 'Pagos', icon: 'card', requiredRole: ['main_admin', 'sales', 'customer_service'] },
    { type: 'instructions' as ReportType, title: 'Instrucciones', icon: 'document-text', requiredRole: ['main_admin', 'customer_service', 'customs_broker'] },
    { type: 'clients' as ReportType, title: 'Clientes', icon: 'people', requiredRole: ['main_admin', 'sales', 'customer_service'] },
    { type: 'revenue' as ReportType, title: 'Ingresos', icon: 'trending-up', requiredRole: ['main_admin', 'sales'] },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const dashboardWidgets = await reportsService.getDashboardWidgets(user.id, user.role);
      setWidgets(dashboardWidgets);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await reportsService.generateReport(filter);
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'No se pudo generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'excel' | 'pdf' = 'excel') => {
    if (!reportData) {
      Alert.alert('Error', 'Primero genera un reporte');
      return;
    }

    setLoading(true);
    try {
      const content = await reportsService.exportToExcel(reportData, {
        format,
        includeCharts: true,
        includeDetails: true
      });
      
      await reportsService.shareReport(content, `reporte_${selectedReport}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      Alert.alert('Éxito', 'Reporte exportado correctamente');
      setExportModalVisible(false);
    } catch (error) {
      console.error('Error exporting report:', error);
      Alert.alert('Error', 'No se pudo exportar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableReports = () => {
    return reportTypes.filter(report => 
      report.requiredRole.includes(user?.role || '')
    );
  };

  const renderWidget = (widget: DashboardWidget) => {
    return (
      <View key={widget.id} style={[styles.widget, { borderLeftColor: widget.color }]}>
        <View style={styles.widgetHeader}>
          <Ionicons name={widget.icon as any} size={24} color={widget.color} />
          <Text style={styles.widgetTitle}>{widget.title}</Text>
        </View>
        
        <Text style={styles.widgetValue}>{widget.value}</Text>
        
        {widget.change && (
          <View style={styles.changeContainer}>
            <Ionicons 
              name={widget.change > 0 ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={widget.change > 0 ? '#10b981' : '#ef4444'} 
            />
            <Text style={[styles.changeText, { color: widget.change > 0 ? '#10b981' : '#ef4444' }]}>
              {Math.abs(widget.change)}%
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderFilterModal = () => {
    return (
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros de Reporte</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Rango de Fechas</Text>
              
              <View style={styles.dateRow}>
                <View style={styles.dateInput}>
                  <Text style={styles.dateLabel}>Desde:</Text>
                  <TextInput
                    style={styles.input}
                    value={filter.dateRange.from}
                    onChangeText={(text) => setFilter({
                      ...filter,
                      dateRange: { ...filter.dateRange, from: text }
                    })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                
                <View style={styles.dateInput}>
                  <Text style={styles.dateLabel}>Hasta:</Text>
                  <TextInput
                    style={styles.input}
                    value={filter.dateRange.to}
                    onChangeText={(text) => setFilter({
                      ...filter,
                      dateRange: { ...filter.dateRange, to: text }
                    })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={() => {
                  setFilterModalVisible(false);
                  generateReport();
                }}
              >
                <Text style={styles.primaryButtonText}>Aplicar Filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderExportModal = () => {
    return (
      <Modal visible={exportModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exportar Reporte</Text>
              <TouchableOpacity onPress={() => setExportModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.exportOptions}>
              <TouchableOpacity 
                style={styles.exportOption}
                onPress={() => exportReport('excel')}
              >
                <Ionicons name="document" size={32} color="#10b981" />
                <Text style={styles.exportOptionText}>Excel (.xlsx)</Text>
                <Text style={styles.exportOptionDesc}>Hoja de cálculo con datos completos</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setExportModalVisible(false)}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (!user || !['main_admin', 'sales', 'customer_service'].includes(user.role)) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Ionicons name="analytics" size={64} color="#ef4444" />
        <Text style={styles.unauthorizedText}>Acceso Restringido</Text>
        <Text style={styles.unauthorizedSubtext}>
          No tienes permisos para acceder a los reportes
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes y Analytics</Text>
        <Text style={styles.subtitle}>Métricas y análisis del sistema</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Dashboard Widgets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#1e3a8a" style={styles.loader} />
          ) : (
            <View style={styles.widgetsGrid}>
              {widgets.map(renderWidget)}
            </View>
          )}
        </View>

        {/* Tipos de Reportes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Reporte</Text>
          
          <View style={styles.reportsGrid}>
            {getAvailableReports().map((report) => (
              <TouchableOpacity
                key={report.type}
                style={[
                  styles.reportCard,
                  selectedReport === report.type && styles.selectedReportCard
                ]}
                onPress={() => setSelectedReport(report.type)}
              >
                <Ionicons name={report.icon as any} size={32} color="#1e3a8a" />
                <Text style={styles.reportCardTitle}>{report.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.filterButton]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Configurar Filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.generateButton]}
            onPress={generateReport}
            disabled={loading}
          >
            <Ionicons name="analytics" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Generar Reporte</Text>
          </TouchableOpacity>

          {reportData && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.exportButton]}
              onPress={() => setExportModalVisible(true)}
            >
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Exportar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Resumen del Reporte */}
        {reportData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen del Reporte</Text>
            
            <View style={styles.reportSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Período:</Text>
                <Text style={styles.summaryValue}>
                  {filter.dateRange.from} a {filter.dateRange.to}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Contenedores:</Text>
                <Text style={styles.summaryValue}>{reportData.metrics.totalContainers}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Contenedores Activos:</Text>
                <Text style={styles.summaryValue}>{reportData.metrics.activeContainers}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ingresos Totales:</Text>
                <Text style={styles.summaryValue}>
                  ${reportData.metrics.totalRevenue.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiempo Promedio:</Text>
                <Text style={styles.summaryValue}>
                  {reportData.metrics.averageProcessingTime} días
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {renderFilterModal()}
      {renderExportModal()}
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  loader: {
    marginVertical: 20,
  },
  widgetsGrid: {
    gap: 15,
  },
  widget: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  widgetValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  reportCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedReportCard: {
    borderColor: '#1e3a8a',
    backgroundColor: '#f0f4ff',
  },
  reportCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#6b7280',
  },
  generateButton: {
    backgroundColor: '#1e3a8a',
  },
  exportButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  reportSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1e3a8a',
  },
  secondaryButton: {
    backgroundColor: '#6b7280',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  exportOptions: {
    marginBottom: 20,
  },
  exportOption: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  exportOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  exportOptionDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  unauthorizedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 20,
    textAlign: 'center',
  },
  unauthorizedSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
});