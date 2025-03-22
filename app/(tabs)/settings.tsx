import { StyleSheet, View, Text, ScrollView, Switch, Platform, Pressable } from 'react-native';
import { useState } from 'react';
import { Bell, Shield, Gauge, Bluetooth, ChevronRight } from 'lucide-react-native';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [highTdsAlerts, setHighTdsAlerts] = useState(true);
  const [connectionAlerts, setConnectionAlerts] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.setting}>
          <View style={styles.settingIcon}>
            <Bell size={20} color="#0891b2" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts about water quality
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
            thumbColor={Platform.OS === 'ios' ? '#ffffff' : undefined}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingIcon}>
            <Shield size={20} color="#0891b2" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>High TDS Alerts</Text>
            <Text style={styles.settingDescription}>
              Alert when TDS exceeds 500 PPM
            </Text>
          </View>
          <Switch
            value={highTdsAlerts}
            onValueChange={setHighTdsAlerts}
            trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
            thumbColor={Platform.OS === 'ios' ? '#ffffff' : undefined}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingIcon}>
            <Bluetooth size={20} color="#0891b2" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Connection Alerts</Text>
            <Text style={styles.settingDescription}>
              Alert on device disconnection
            </Text>
          </View>
          <Switch
            value={connectionAlerts}
            onValueChange={setConnectionAlerts}
            trackColor={{ false: '#e2e8f0', true: '#0891b2' }}
            thumbColor={Platform.OS === 'ios' ? '#ffffff' : undefined}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Measurement</Text>
        <Pressable style={styles.setting}>
          <View style={styles.settingIcon}>
            <Gauge size={20} color="#0891b2" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Calibration</Text>
            <Text style={styles.settingDescription}>
              Calibrate your sensors
            </Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </Pressable>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.version}>Version 1.0.0</Text>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94a3b8',
  },
});