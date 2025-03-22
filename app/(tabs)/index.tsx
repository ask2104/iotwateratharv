import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { GaugeChart } from '@/components/GaugeChart';
import { DrinkabilityMeter } from '@/components/DrinkabilityMeter';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [tds, setTds] = useState(250);
  const [temperature, setTemperature] = useState(25);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTds(prev => prev + (Math.random() - 0.5) * 20);
      setTemperature(prev => prev + (Math.random() - 0.5) * 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
});