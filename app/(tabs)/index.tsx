import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { GaugeChart } from '@/components/GaugeChart';
import { DrinkabilityMeter } from '@/components/DrinkabilityMeter';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [tds, setTds] = useState(250);
  const [temperature, setTemperature] = useState(25);
  const [error, setError] = useState<string | null>(null);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // In a real app, this would be an API call
        const newTds = tds + (Math.random() - 0.5) * 20;
        const newTemp = temperature + (Math.random() - 0.5) * 2;
        
        // Validate the data
        if (newTds < 0 || newTemp < 0) {
          throw new Error('Invalid sensor readings detected');
        }
        
        setTds(newTds);
        setTemperature(newTemp);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update sensor data');
        console.error('Error updating sensor data:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [tds, temperature]);

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>Please check your sensor connection</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Quality</Text>
        <Text style={styles.subtitle}>Real-time Monitoring</Text>
      </View>

      <View style={styles.gaugesContainer}>
        <GaugeChart
          value={tds}
          maxValue={1000}
          size={200}
          title="Total Dissolved Solids"
          unit="PPM"
          color="#0891b2"
        />
        <GaugeChart
          value={temperature}
          maxValue={50}
          size={200}
          title="Temperature"
          unit="°C"
          color="#f97316"
        />
      </View>

      <DrinkabilityMeter tds={tds} temperature={temperature} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 32,
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  gaugesContainer: {
    paddingHorizontal: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 8,
  },
  errorSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
});