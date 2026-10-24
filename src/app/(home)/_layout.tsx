import React from 'react';
import { Stack } from 'expo-router';
import { usePalette } from '../../theme/AppearanceContext';

export default function HomeLayout() {
  const palette = usePalette();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: palette.bg,
        },
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalle',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
