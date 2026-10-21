import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorThemeId, getTypePalette, RecordKind, TypeColors } from './tokens';

const THEME_KEY = 'cronia.appearance';
const MODE_KEY = 'cronia.mode';

export type ColorMode = 'light' | 'dark' | 'auto';

interface AppearanceValue {
  themeId: ColorThemeId;
  setThemeId: (id: ColorThemeId) => void;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  /** true cuando el modo resuelto es oscuro (para la vista previa y futuros temas oscuros) */
  dark: boolean;
  colors: Record<RecordKind, TypeColors>;
}

const AppearanceContext = createContext<AppearanceValue>({
  themeId: 'cronia',
  setThemeId: () => {},
  mode: 'light',
  setMode: () => {},
  dark: false,
  colors: getTypePalette('cronia'),
});

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ColorThemeId>('cronia');
  const [mode, setModeState] = useState<ColorMode>('light');
  const system = useColorScheme();

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(THEME_KEY)
      .then((raw) => {
        if (mounted && (raw === 'suave' || raw === 'contraste')) {
          setThemeIdState(raw);
        }
      })
      .catch(() => {});
    AsyncStorage.getItem(MODE_KEY)
      .then((raw) => {
        if (mounted && (raw === 'light' || raw === 'dark' || raw === 'auto')) {
          setModeState(raw);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const setThemeId = useCallback((id: ColorThemeId) => {
    setThemeIdState(id);
    AsyncStorage.setItem(THEME_KEY, id).catch(() => {});
  }, []);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    AsyncStorage.setItem(MODE_KEY, next).catch(() => {});
  }, []);

  const dark = mode === 'dark' || (mode === 'auto' && system === 'dark');

  const value = useMemo(
    () => ({ themeId, setThemeId, mode, setMode, dark, colors: getTypePalette(themeId) }),
    [themeId, setThemeId, mode, setMode, dark]
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceValue {
  return useContext(AppearanceContext);
}
