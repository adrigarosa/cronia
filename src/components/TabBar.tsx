import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { ListNavIcon, SearchIcon, BarsNavIcon } from './icons';
import { fonts, Palette } from '../theme/tokens';
import { usePalette } from '../theme/AppearanceContext';

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONS: Record<string, (p: { size?: number; color?: string }) => React.ReactElement> = {
  index: ListNavIcon,
  search: SearchIcon,
  stats: BarsNavIcon,
};

/**
 * Barra de pestañas de la plantilla: 3 destinos, píldora activa, altura 76 + inset.
 */
export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const styles = useMemo(() => makeStyles(palette), [palette]);

  return (
    <View style={[styles.bar, { height: 76 + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = ICONS[route.name] ?? ListNavIcon;
        const color = focused ? palette.ink : palette.inkSoft;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={route.name}
            onPress={onPress}
            style={styles.item}
          >
            <View style={[styles.pill, focused && styles.pillOn]}>
              <Icon size={20} color={color} />
            </View>
            <Text style={[styles.label, { color, fontWeight: focused ? '700' : '600' }]}>
              {route.name === 'index' ? 'Cronología' : route.name === 'search' ? 'Buscar' : 'Seguimiento'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (palette: Palette) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: palette.surface,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    pill: {
      width: 56,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillOn: {
      backgroundColor: palette.navPill,
    },
    label: {
      fontSize: 12,
      fontFamily: fonts.medium,
    },
  });
