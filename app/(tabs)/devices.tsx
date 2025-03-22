import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useState } from 'react';
import { Wifi, WifiOff, Bluetooth, BluetoothOff, RefreshCw } from 'lucide-react-native';

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
          <RefreshCw
            size={20}
            color="#ffffff"
            style={[scanning && Platform.select({
              web: { animationName: 'spin', animationDuration: '1s', animationIterationCount: 'infinite', animationTimingFunction: 'linear' },
              default: styles.rotating
            })]}
          />
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
  rotating: {
    transform: [{ rotate: '360deg' }],
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
});