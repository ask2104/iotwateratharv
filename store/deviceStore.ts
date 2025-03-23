import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Device } from '../types/device';
import { apiService } from '../services/apiService';
import { supabaseService } from '../services/supabaseService';

interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  isLoading: boolean;
  error: string | null;
  addDevice: (device: Omit<Device, 'id' | 'last_seen' | 'status' | 'created_at'>) => Promise<void>;
  removeDevice: (deviceId: string) => Promise<void>;
  selectDevice: (deviceId: string) => void;
  updateDeviceStatus: (deviceId: string, status: string) => Promise<void>;
  fetchDevices: () => Promise<void>;
  clearError: () => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set, get) => ({
      devices: [],
      selectedDevice: null,
      isLoading: false,
      error: null,

      addDevice: async (device) => {
        try {
          set({ isLoading: true, error: null });
          const newDevice = await supabaseService.addDevice(device);
          set((state) => ({
            devices: [...state.devices, newDevice],
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error adding device:', error);
          set({
            error: 'Failed to add device. Please try again.',
            isLoading: false,
          });
        }
      },

      removeDevice: async (deviceId) => {
        try {
          set({ isLoading: true, error: null });
          await supabaseService.removeDevice(deviceId);
          set((state) => ({
            devices: state.devices.filter((d) => d.id !== deviceId),
            selectedDevice: state.selectedDevice?.id === deviceId ? null : state.selectedDevice,
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error removing device:', error);
          set({
            error: 'Failed to remove device. Please try again.',
            isLoading: false,
          });
        }
      },

      selectDevice: (deviceId) => {
        const device = get().devices.find((d) => d.id === deviceId);
        if (device) {
          set({ selectedDevice: device });
        }
      },

      updateDeviceStatus: async (deviceId, status) => {
        try {
          set({ isLoading: true, error: null });
          const updatedDevice = await supabaseService.updateDeviceStatus(deviceId, status);
          set((state) => ({
            devices: state.devices.map((d) =>
              d.id === deviceId ? { ...d, status, last_seen: new Date().toISOString() } : d
            ),
            selectedDevice:
              state.selectedDevice?.id === deviceId
                ? { ...state.selectedDevice, status, last_seen: new Date().toISOString() }
                : state.selectedDevice,
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error updating device status:', error);
          set({
            error: 'Failed to update device status. Please try again.',
            isLoading: false,
          });
        }
      },

      fetchDevices: async () => {
        try {
          set({ isLoading: true, error: null });
          const devices = await supabaseService.getDevices();
          set({ devices, isLoading: false });
        } catch (error) {
          console.error('Error fetching devices:', error);
          set({
            error: 'Failed to fetch devices. Please try again.',
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'device-storage',
      partialize: (state) => ({
        devices: state.devices,
        selectedDevice: state.selectedDevice,
      }),
    }
  )
); 