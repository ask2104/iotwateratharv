import { Platform } from 'react-native';

// ESP32 Configuration
const ESP32_BASE_URL = 'http://192.168.1.100'; // Change this to your ESP32's IP address
const API_ENDPOINTS = {
  sensorData: '/sensor-data',
  deviceStatus: '/device-status',
  wifiConfig: '/wifi-config',
  clearHistory: '/clear-history',
  historicalData: '/historical-data',
} as const;

// API Configuration
const API_CONFIG = {
  timeout: 5000, // 5 seconds timeout
  retries: 2,    // Number of retries for failed requests
  retryDelay: 1000, // Delay between retries in ms
} as const;

interface SensorData {
  tds: number;
  temperature: number;
  timestamp: string;
  drinkability: string;
}

interface DeviceStatus {
  connected: boolean;
  signal: number;
  lastSeen: string;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

// API Error Codes
const API_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  INVALID_DATA: 'INVALID_DATA',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

// Validation Constants
const VALIDATION_CONSTANTS = {
  MIN_TDS: 0,
  MAX_TDS: 2000,
  MIN_TEMPERATURE: -10,
  MAX_TEMPERATURE: 100,
} as const;

// Helper function for API calls with timeout and retries
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_CONFIG.timeout
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Helper function for retrying failed requests
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries: number = API_CONFIG.retries
): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
      return retryRequest(requestFn, retries - 1);
    }
    throw error;
  }
}

// Helper function to validate sensor data
function validateSensorData(data: unknown): data is SensorData {
  if (!data || typeof data !== 'object') return false;
  const sensorData = data as SensorData;
  
  // Check types
  if (
    typeof sensorData.tds !== 'number' ||
    typeof sensorData.temperature !== 'number' ||
    typeof sensorData.timestamp !== 'string' ||
    typeof sensorData.drinkability !== 'string'
  ) return false;

  // Check ranges
  if (
    sensorData.tds < VALIDATION_CONSTANTS.MIN_TDS ||
    sensorData.tds > VALIDATION_CONSTANTS.MAX_TDS ||
    sensorData.temperature < VALIDATION_CONSTANTS.MIN_TEMPERATURE ||
    sensorData.temperature > VALIDATION_CONSTANTS.MAX_TEMPERATURE
  ) return false;

  // Check timestamp format
  const timestamp = new Date(sensorData.timestamp);
  if (isNaN(timestamp.getTime())) return false;

  return true;
}

// Helper function to create API errors
function createApiError(message: string, code: keyof typeof API_ERROR_CODES, status?: number): ApiError {
  const error = new Error(message) as ApiError;
  error.code = API_ERROR_CODES[code];
  error.status = status;
  return error;
}

export const apiService = {
  // Get real-time sensor data
  getSensorData: async (ipAddress: string): Promise<SensorData> => {
    try {
      const response = await retryRequest(() =>
        fetchWithTimeout(`http://${ipAddress}${API_ENDPOINTS.sensorData}`)
      );
      
      if (!response.ok) {
        throw createApiError('Failed to fetch sensor data', 'SERVER_ERROR', response.status);
      }

      const data = await response.json();
      if (!validateSensorData(data)) {
        throw createApiError('Invalid sensor data format', 'INVALID_DATA');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw createApiError(error.message, 'NETWORK_ERROR');
      }
      throw error;
    }
  },

  // Get device connection status
  getDeviceStatus: async (ipAddress: string): Promise<DeviceStatus> => {
    try {
      const response = await retryRequest(() =>
        fetchWithTimeout(`http://${ipAddress}${API_ENDPOINTS.deviceStatus}`)
      );
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to fetch device status');
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid device status format');
      }

      return {
        connected: Boolean(data.connected),
        signal: Number(data.signal) || 0,
        lastSeen: String(data.lastSeen) || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching device status:', error);
      return {
        connected: false,
        signal: 0,
        lastSeen: new Date().toISOString(),
      };
    }
  },

  // Configure WiFi settings
  configureWiFi: async (ipAddress: string, ssid: string, password: string): Promise<boolean> => {
    try {
      const response = await retryRequest(() =>
        fetchWithTimeout(`http://${ipAddress}${API_ENDPOINTS.wifiConfig}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ssid, password }),
        })
      );
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to configure WiFi');
        error.status = response.status;
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error configuring WiFi:', error);
      return false;
    }
  },

  // Clear historical data
  clearHistory: async (ipAddress: string): Promise<boolean> => {
    try {
      const response = await retryRequest(() =>
        fetchWithTimeout(`http://${ipAddress}${API_ENDPOINTS.clearHistory}`, {
          method: 'POST',
        })
      );
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to clear history');
        error.status = response.status;
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  },

  // Get historical data
  getHistoricalData: async (ipAddress: string): Promise<SensorData[]> => {
    try {
      const response = await retryRequest(() =>
        fetchWithTimeout(`http://${ipAddress}${API_ENDPOINTS.historicalData}`)
      );
      
      if (!response.ok) {
        const error: ApiError = new Error('Failed to fetch historical data');
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid historical data format');
      }

      return data.filter(validateSensorData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }
}; 