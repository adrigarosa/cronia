/**
 * Hook personalizado para gestionar temas
 */

import { useSettings } from './useSettings';
import { getTheme, ThemeColors, ThemeType } from '../constants/themes';

interface UseThemeResult {
  theme: ThemeType;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: ThemeType) => Promise<void>;
}

export function useTheme(): UseThemeResult {
  const { settings, updateSetting } = useSettings();

  const currentTheme = settings?.theme || 'light';
  const themeColors = getTheme(currentTheme).colors;
  const isDark = currentTheme === 'dark';

  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    await updateSetting('theme', newTheme);
  };

  const setTheme = async (theme: ThemeType) => {
    await updateSetting('theme', theme);
  };

  return {
    theme: currentTheme,
    colors: themeColors,
    isDark,
    toggleTheme,
    setTheme,
  };
}
