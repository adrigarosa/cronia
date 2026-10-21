/**
 * Hook personalizado para gestionar configuración
 */

import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
}

interface UseSettingsResult {
  settings: AppSettings | null;
  loading: boolean;
  error: string | null;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'es',
  notificationsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

const SETTINGS_KEY = 'cronia_settings';

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración al inicializar
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppSettings;
        setSettings(parsed);
      } else {
        setSettings(DEFAULT_SETTINGS);
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (err) {
      setError((err as Error).message);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      try {
        setError(null);
        if (!settings) return;

        const updated = { ...settings, [key]: value };
        setSettings(updated);
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (err) {
        setError((err as Error).message);
        console.error('Error updating setting:', err);
        throw err;
      }
    },
    [settings]
  );

  const resetSettings = useCallback(async () => {
    try {
      setError(null);
      setSettings(DEFAULT_SETTINGS);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (err) {
      setError((err as Error).message);
      console.error('Error resetting settings:', err);
      throw err;
    }
  }, []);

  return {
    settings,
    loading,
    error,
    updateSetting,
    resetSettings,
  };
}
