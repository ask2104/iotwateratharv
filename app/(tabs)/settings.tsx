import { StyleSheet, View, Text, ScrollView, Switch, Platform, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { Bell, Shield, Trash2, ChevronRight } from 'lucide-react-native';
import { apiService } from '@/services/apiService';
import { useTheme } from '../../theme/ThemeContext';
import { supabaseService } from '../../services/supabaseService';
import { Ionicons } from '@expo/vector-icons';
import { useDeviceStore } from '../../store/deviceStore';

export default function Settings() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { selectedDevice } = useDeviceStore();
  const [notifications, setNotifications] = useState(true);
  const [highTdsAlerts, setHighTdsAlerts] = useState(true);
  const [isErasing, setIsErasing] = useState(false);

  const handleEraseHistory = async () => {
    if (!selectedDevice) {
      Alert.alert("Error", "No device selected. Please select a device first.");
      return;
    }

    Alert.alert(
      "Erase History",
      "Are you sure you want to erase all historical data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Erase",
          style: "destructive",
          onPress: async () => {
            try {
              setIsErasing(true);
              await Promise.all([
                supabaseService.clearHistory(),
                apiService.clearHistory(selectedDevice.ip_address)
              ]);
              Alert.alert("Success", "All historical data has been erased.");
            } catch (error) {
              console.error('Error erasing history:', error);
              Alert.alert(
                "Error",
                "Failed to erase historical data. Please try again later."
              );
            } finally {
              setIsErasing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>Configure your preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
        <View style={styles.setting}>
          <View style={styles.settingIcon}>
            <Bell size={20} color={theme.colors.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Push Notifications</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text }]}>
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
            <Shield size={20} color={theme.colors.text} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>High TDS Alerts</Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text }]}>
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
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Management</Text>
        <Pressable
          style={[styles.setting, { backgroundColor: theme.colors.card }]}
          onPress={handleEraseHistory}
          disabled={isErasing}
        >
          <View style={styles.settingIcon}>
            <Ionicons 
              name="trash-outline" 
              size={24} 
              color={theme.colors.error} 
            />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.error }]}>
              {isErasing ? 'Erasing...' : 'Erase History'}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text }]}>
              Delete all historical sensor data
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={theme.colors.text} 
          />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
        <Pressable
          style={[styles.option, { backgroundColor: theme.colors.card }]}
          onPress={toggleTheme}
        >
          <View style={styles.optionContent}>
            <Ionicons 
              name={isDark ? "sunny" : "moon"} 
              size={24} 
              color={theme.colors.text} 
            />
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={theme.colors.text} 
          />
        </Pressable>
      </View>

      <View style={styles.versionContainer}>
        <Text style={[styles.version, { color: theme.colors.text }]}>Version 1.0.0</Text>
      </View>
    </ScrollView>
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
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
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
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
  },
});