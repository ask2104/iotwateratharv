import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Animated, Alert } from 'react-native';
import { supabaseService } from '../../services/supabaseService';
import { Device } from '../../types/device';
import { apiService } from '../../services/apiService';
import { useDeviceStore } from '../../store/deviceStore';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Add keyframe animation for web platform
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}

export default function DevicesScreen() {
  const { theme } = useTheme();
  const { devices, addDevice, removeDevice, setSelectedDevice } = useDeviceStore();
  const [isScanning, setIsScanning] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Spinning animation for scan button
  useEffect(() => {
    if (isScanning) {
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
  }, [isScanning]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      // Simulate device discovery
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newDevice = {
        name: `Device ${devices.length + 1}`,
        ip_address: `192.168.1.${devices.length + 1}`,
      };
      const device = await supabaseService.addDevice(newDevice);
      addDevice(device);
    } catch (err) {
      setError('Failed to scan for devices');
      console.error('Error scanning devices:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDevicePress = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleRemoveDevice = async (deviceId: string) => {
    Alert.alert(
      'Remove Device',
      'Are you sure you want to remove this device?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setIsRemoving(deviceId);
            setError(null);
            try {
              await supabaseService.updateDeviceStatus(deviceId, 'offline');
              removeDevice(deviceId);
            } catch (err) {
              setError('Failed to remove device');
              console.error('Error removing device:', err);
            } finally {
              setIsRemoving(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Devices</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Manage your water quality sensors
        </Text>
      </View>

      <ScrollView style={styles.deviceList}>
        {devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="water-outline" 
              size={48} 
              color={theme.colors.text} 
            />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
              No devices found
            </Text>
          </View>
        ) : (
          devices.map((device) => (
            <Pressable
              key={device.id}
              style={[styles.deviceCard, { backgroundColor: theme.colors.card }]}
              onPress={() => handleDevicePress(device)}
            >
              <View style={styles.deviceInfo}>
                <Ionicons 
                  name="water" 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <View style={styles.deviceDetails}>
                  <Text style={[styles.deviceName, { color: theme.colors.text }]}>
                    {device.name}
                  </Text>
                  <Text style={[styles.deviceIp, { color: theme.colors.text }]}>
                    {device.ip_address}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => handleRemoveDevice(device.id)}
                style={styles.removeButton}
                disabled={isRemoving === device.id}
              >
                {isRemoving === device.id ? (
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons 
                      name="sync" 
                      size={20} 
                      color={theme.colors.error} 
                    />
                  </Animated.View>
                ) : (
                  <Ionicons 
                    name="trash-outline" 
                    size={20} 
                    color={theme.colors.error} 
                  />
                )}
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Pressable
        style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleScan}
        disabled={isScanning}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons 
            name="scan-outline" 
            size={24} 
            color="#ffffff" 
          />
        </Animated.View>
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Scanning...' : 'Scan for Devices'}
        </Text>
      </Pressable>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        </View>
      )}
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
  deviceList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceIp: {
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
});