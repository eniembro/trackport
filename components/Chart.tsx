import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ChartData } from '../types/reports';

const { width } = Dimensions.get('window');

interface ChartProps {
  data: ChartData;
  type: 'bar' | 'pie' | 'line';
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, type, height = 200 }) => {
  const renderBarChart = () => {
    const maxValue = Math.max(...data.datasets[0].data);
    
    return (
      <View style={[styles.chartContainer, { height }]}>
        <View style={styles.barsContainer}>
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const barHeight = (value / maxValue) * (height - 60);
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: barHeight,
                        backgroundColor: data.datasets[0].backgroundColor?.[index] || '#3b82f6'
                      }
                    ]} 
                  />
                  <Text style={styles.barValue}>{value}</Text>
                </View>
                <Text style={styles.barLabel}>{label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    
    return (
      <View style={[styles.chartContainer, { height }]}>
        <View style={styles.pieContainer}>
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const percentage = Math.round((value / total) * 100);
            
            return (
              <View key={index} style={styles.pieItem}>
                <View 
                  style={[
                    styles.pieColor, 
                    { backgroundColor: data.datasets[0].backgroundColor?.[index] || '#3b82f6' }
                  ]} 
                />
                <Text style={styles.pieLabel}>{label}</Text>
                <Text style={styles.pieValue}>{percentage}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.datasets[0].data);
    const chartWidth = width - 80;
    const pointWidth = chartWidth / (data.labels.length - 1);
    
    return (
      <View style={[styles.chartContainer, { height }]}>
        <View style={styles.lineContainer}>
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const pointHeight = (value / maxValue) * (height - 80);
            
            return (
              <View key={index} style={[styles.linePoint, { left: index * pointWidth }]}>
                <View 
                  style={[
                    styles.point, 
                    { 
                      bottom: pointHeight,
                      backgroundColor: data.datasets[0].borderColor?.[0] || '#3b82f6'
                    }
                  ]} 
                />
                <Text style={[styles.lineLabel, { bottom: -20 }]}>{label}</Text>
                <Text style={[styles.lineValue, { bottom: pointHeight + 20 }]}>{value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.datasets[0].label}</Text>
      {type === 'bar' && renderBarChart()}
      {type === 'pie' && renderPieChart()}
      {type === 'line' && renderLineChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartContainer: {
    width: '100%',
    position: 'relative',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingHorizontal: 10,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '80%',
    position: 'relative',
  },
  bar: {
    width: 20,
    minHeight: 4,
    borderRadius: 2,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 50,
  },
  pieContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  pieColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  pieLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  pieValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  lineContainer: {
    position: 'relative',
    height: '100%',
    paddingHorizontal: 20,
  },
  linePoint: {
    position: 'absolute',
    alignItems: 'center',
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  lineLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    position: 'absolute',
    width: 40,
    marginLeft: -20,
  },
  lineValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    position: 'absolute',
    width: 40,
    marginLeft: -20,
  },
});

export default Chart;