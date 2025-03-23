import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Animated } from 'react-native';
import { Gauge } from 'react-native-gauge';
import { supabaseService, SensorReading } from '../../services/supabaseService';
import { apiService } from '../../services/apiService';
import { useDeviceStore } from '../../store/deviceStore';
import { useTheme } from '../../theme/ThemeContext';
import { DrinkabilityMeter } from '../../components/DrinkabilityMeter';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedDevice } = useDeviceStore();
  const [sensorData, setSensorData] = useState<SensorReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const subscription = useRef<any>(null);

  // Spinning animation for refresh button
  useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isRefreshing]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const fetchSensorData = async () => {
    if (!selectedDevice) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Get latest reading from Supabase
      const readings = await supabaseService.getLatestReadings(selectedDevice.id, 1);
      if (readings && readings.length > 0) {
        setSensorData(readings[0]);
      } else {
        // Fallback to API if no data in Supabase
        const data = await apiService.getSensorData(selectedDevice.ip_address);
        if (data) {
          // Store in Supabase
          const newReading = await supabaseService.addSensorReading({
            device_id: selectedDevice.id,
            tds_value: data.tds,
            temperature: data.temperature,
            drinkability: data.drinkability,
          });
          setSensorData(newReading);
        }
      }
    } catch (err) {
      setError('Failed to fetch sensor data');
      console.error('Error fetching sensor data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Set up real-time updates
  useEffect(() => {
    if (!selectedDevice) return;

    // Initial fetch
    fetchSensorData();

    // Subscribe to real-time updates
    subscription.current = supabaseService.subscribeToReadings(
      selectedDevice.id,
      (newReading) => {
        setSensorData(newReading);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
      }
    };
  }, [selectedDevice]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSensorData();
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

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {selectedDevice.name}
        </Text>
        <Pressable 
          onPress={handleRefresh}
          style={[styles.refreshButton, { backgroundColor: theme.colors.card }]}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons 
              name="refresh" 
              size={24} 
              color={theme.colors.text} 
            />
          </Animated.View>
          <Text style={[styles.refreshText, { color: theme.colors.text }]}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <Pressable 
            onPress={handleRefresh}
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading sensor data...
          </Text>
        </View>
      ) : sensorData ? (
        <View style={styles.content}>
          <View style={styles.gaugeContainer}>
            <Gauge
              value={sensorData.tds_value}
              minValue={0}
              maxValue={2000}
              unit="ppm"
              label="TDS"
              valueStyle={{ color: theme.colors.text }}
              labelStyle={{ color: theme.colors.text }}
            />
            <Gauge
              value={sensorData.temperature}
              minValue={0}
              maxValue={50}
              unit="°C"
              label="Temperature"
              valueStyle={{ color: theme.colors.text }}
              labelStyle={{ color: theme.colors.text }}
            />
          </View>

          <View style={styles.drinkabilityContainer}>
            <Text style={[styles.drinkabilityLabel, { color: theme.colors.text }]}>
              Water Quality
            </Text>
            <DrinkabilityMeter
              status={sensorData.drinkability}
              color={getDrinkabilityColor(sensorData.drinkability)}
            />
          </View>

          <View style={styles.timestampContainer}>
            <Text style={[styles.timestamp, { color: theme.colors.text }]}>
              Last updated: {new Date(sensorData.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  refreshText: {
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  gaugeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  drinkabilityContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  drinkabilityLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  timestampContainer: {
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    opacity: 0.7,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});