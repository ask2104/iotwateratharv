import { supabase } from '../lib/supabase';

export interface Device {
  id: string;
  name: string;
  ip_address: string;
  last_seen: string;
  status: string;
}

export interface SensorReading {
  id: string;
  device_id: string;
  tds_value: number;
  temperature: number;
  drinkability: string;
  timestamp: string;
}

export interface UserPreferences {
  user_id: string;
  device_id: string;
  tds_threshold: number;
  temperature_threshold: number;
  notification_enabled: boolean;
}

export const supabaseService = {
  // Device operations
  async addDevice(device: Omit<Device, 'id' | 'last_seen' | 'status' | 'created_at'>) {
    const { data, error } = await supabase
      .from('devices')
      .insert([device])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDeviceStatus(deviceId: string, status: string) {
    const { data, error } = await supabase
      .from('devices')
      .update({ status, last_seen: new Date().toISOString() })
      .eq('id', deviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Sensor readings operations
  async addSensorReading(reading: Omit<SensorReading, 'id' | 'timestamp'>) {
    const { data, error } = await supabase
      .from('sensor_readings')
      .insert([reading])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getLatestReadings(deviceId: string, limit: number = 24) {
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // User preferences operations
  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserPreferences(preferences: Partial<UserPreferences>) {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([preferences])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Real-time subscriptions
  subscribeToReadings(deviceId: string, callback: (reading: SensorReading) => void) {
    return supabase
      .channel('sensor_readings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => callback(payload.new as SensorReading)
      )
      .subscribe();
  },
}; 