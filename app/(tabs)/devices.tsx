import { StyleSheet, View, Text, ScrollView, Pressable, Platform, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, Bluetooth, BluetoothOff, RefreshCw } from 'lucide-react-native';

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

interface Device {
  id: string;
  name: string;
  connected: boolean;
  lastSeen: string;
  signal: number;
}

export default function Devices() {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'WQMS_Kitchen',
      connected: true,
      lastSeen: 'Now',
      signal: 85,
    },
    {
      id: '2',
      name: 'WQMS_Bathroom',
      connected: false,
      lastSeen: '5 min ago',
      signal: 45,
    },
  ]);

  const spinValue = useRef(new Animated.Value(0)).current;

  // Set up the animation
  useEffect(() => {
    if (scanning) {
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
  }, [scanning]);

  // Create the rotation interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  const getSignalIcon = (signal: number) => {
    if (signal > 70) return Wifi;
    if (signal > 30) return Wifi;
    return WifiOff;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Devices</Text>
        <Pressable
          style={[styles.scanButton, scanning && styles.scanningButton]}
          onPress={handleScan}>
          {Platform.OS === 'web' ? (
            <View style={scanning ? styles.webSpinAnimation : undefined}>
              <RefreshCw size={20} color="#ffffff" />
            </View>
          ) : (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <RefreshCw size={20} color="#ffffff" />
            </Animated.View>
          )}
          <Text style={styles.scanButtonText}>
            {scanning ? 'Scanning...' : 'Scan'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.devicesList}>
        {devices.map(device => {
          const SignalIcon = getSignalIcon(device.signal);
          const ConnectIcon = device.connected ? Bluetooth : BluetoothOff;

          return (
            <Pressable
              key={device.id}
              style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceStatus}>
                  {device.connected ? 'Connected' : 'Disconnected'} • {device.lastSeen}
                </Text>
              </View>
              <View style={styles.deviceIcons}>
                <SignalIcon size={20} color={device.signal > 30 ? '#0891b2' : '#94a3b8'} />
                <ConnectIcon
                  size={20}
                  color={device.connected ? '#0891b2' : '#94a3b8'}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 32,
    color: '#0f172a',
  },
  scanButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanningButton: {
    backgroundColor: '#0891b2',
    opacity: 0.8,
  },
  scanButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
  devicesList: {
    padding: 16,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 4,
  },
  deviceStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  deviceIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webSpinAnimation: {
    animation: 'spin 1s linear infinite',
  } as any, // Type assertion needed for web-specific CSS
});