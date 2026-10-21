import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorThemeId, getTypePalette, RecordKind, TypeColors } from './tokens';

const APPEARANCE_KEY = 'cronia.appearance';

interface AppearanceValue {
  themeId: ColorThemeId;
  setThemeId: (id: ColorThemeId) => void;
  colors: Record<RecordKind, TypeColors>;
}

const AppearanceContext = createContext<AppearanceValue>({
  themeId: 'cronia',
  setThemeId: () => {},
  colors: getTypePalette('cronia'),
});

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ColorThemeId>('cronia');

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(APPEARANCE_KEY)
      .then((raw) => {
        if (mounted && (raw === 'suave' || raw === 'contraste')) {
          setThemeIdState(raw as ColorThemeId);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const setThemeId = useCallback((id: ColorThemeId) => {
    setThemeIdState(id);
    AsyncStorage.setItem(APPEARANCE_KEY, id).catch(() => {});
  }, []);

  const value = { themeId, setThemeId, colors: getTypePalette(themeId) };
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceValue {
  return useContext(AppearanceContext);
}
