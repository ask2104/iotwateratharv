import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { supabaseService, SensorReading } from '../../services/supabaseService';
import { useDeviceStore } from '../../store/deviceStore';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { selectedDevice } = useDeviceStore();
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReadings();
  }, [selectedDevice]);

  const fetchReadings = async () => {
    if (!selectedDevice) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await supabaseService.getLatestReadings(selectedDevice.id, 24);
      setReadings(data);
    } catch (err) {
      setError('Failed to fetch historical data');
      console.error('Error fetching readings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDrinkabilityColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return theme.colors.success;
      case 'good':
        return theme.colors.warning;
      case 'fair':
        return theme.colors.warning;
      case 'poor':
        return theme.colors.error;
      default:
        return theme.colors.text;
    }
  };

  if (!selectedDevice) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.text, { color: theme.colors.text }]}>
          Please select a device in the Devices tab
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.text, { color: theme.colors.text }]}>
          Loading historical data...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
        <Pressable
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={fetchReadings}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Last 24 readings from {selectedDevice.name}
        </Text>
      </View>

      <ScrollView style={styles.readingsList}>
        {readings.map((reading) => (
          <View
            key={reading.id}
            style={[styles.readingCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.readingHeader}>
              <Text style={[styles.timestamp, { color: theme.colors.text }]}>
                {new Date(reading.timestamp).toLocaleString()}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getDrinkabilityColor(reading.drinkability) },
                ]}
              >
                <Text style={styles.statusText}>{reading.drinkability}</Text>
              </View>
            </View>

            <View style={styles.readingValues}>
              <View style={styles.valueContainer}>
                <Ionicons name="water" size={20} color={theme.colors.primary} />
                <Text style={[styles.value, { color: theme.colors.text }]}>
                  {reading.tds_value} ppm
                </Text>
              </View>
              <View style={styles.valueContainer}>
                <Ionicons name="thermometer" size={20} color={theme.colors.primary} />
                <Text style={[styles.value, { color: theme.colors.text }]}>
                  {reading.temperature}°C
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  readingsList: {
    flex: 1,
  },
  readingCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  readingValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});