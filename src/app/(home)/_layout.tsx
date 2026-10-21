import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function HomeLayout() {
  return (
    <Stack
      id="home-stack"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.light.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
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
