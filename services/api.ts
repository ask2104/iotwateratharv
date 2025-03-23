import { Platform } from 'react-native';

// ESP32 Configuration
const ESP32_BASE_URL = 'http://192.168.1.100'; // Change this to your ESP32's IP address
const API_ENDPOINTS = {
  sensorData: '/sensor-data',
  deviceStatus: '/device-status',
  wifiConfig: '/wifi-config',
  clearHistory: '/clear-history',
};

interface SensorData {
  tds: number;
  temperature: number;
  timestamp: string;
}

interface DeviceStatus {
  connected: boolean;
  signal: number;
  lastSeen: string;
}

export const api = {
  // Get real-time sensor data
  getSensorData: async (): Promise<SensorData> => {
    try {
      const response = await fetch(`${ESP32_BASE_URL}${API_ENDPOINTS.sensorData}`);
      if (!response.ok) throw new Error('Failed to fetch sensor data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  },

  // Get device connection status
  getDeviceStatus: async (): Promise<DeviceStatus> => {
    try {
      const response = await fetch(`${ESP32_BASE_URL}${API_ENDPOINTS.deviceStatus}`);
      if (!response.ok) throw new Error('Failed to fetch device status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching device status:', error);
      throw error;
    }
  },

  // Configure WiFi settings
  configureWiFi: async (ssid: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${ESP32_BASE_URL}${API_ENDPOINTS.wifiConfig}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ssid, password }),
      });
      if (!response.ok) throw new Error('Failed to configure WiFi');
    } catch (error) {
      console.error('Error configuring WiFi:', error);
      throw error;
    }
  },

  // Clear historical data
  clearHistory: async (): Promise<void> => {
    try {
      const response = await fetch(`${ESP32_BASE_URL}${API_ENDPOINTS.clearHistory}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to clear history');
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  },
}; 