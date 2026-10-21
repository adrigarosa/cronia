import React from 'react';
import { Stack } from 'expo-router';
import { palette } from '../../theme/tokens';

export default function HomeLayout() {
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
