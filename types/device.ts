export interface Device {
  id: string;
  name: string;
  ip_address: string;
  mac_address: string;
  status: 'online' | 'offline' | 'error';
  last_seen: string;
  created_at: string;
  firmware_version?: string;
  signal_strength?: number;
  battery_level?: number;
  settings?: {
    tds_threshold: number;
    temperature_threshold: number;
    notification_enabled: boolean;
  };
}

export interface DeviceStatus {
  connected: boolean;
  signal: number;
  lastSeen: string;
  batteryLevel?: number;
  firmwareVersion?: string;
}

export interface DeviceSettings {
  tds_threshold: number;
  temperature_threshold: number;
  notification_enabled: boolean;
  update_interval: number;
  data_retention_days: number;
} 