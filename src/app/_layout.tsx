import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { initDB } from '../services/DatabaseService';

const SCREENS = [
  { name: '(home)', title: 'Cronología', headerTitle: 'CRONIA', icon: 'home' },
  { name: 'create', title: 'Crear', headerTitle: 'Nuevo registro', icon: 'plus-circle' },
  { name: 'search', title: 'Buscar', headerTitle: 'Búsqueda y filtros', icon: 'search' },
  { name: 'stats', title: 'Seguimiento', headerTitle: 'Estadísticas', icon: 'bar-chart' },
  { name: 'settings', title: 'Ajustes', headerTitle: 'Configuración', icon: 'cog' },
] as const;

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDB()
      .then(() => setReady(true))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          No se pudo iniciar la base de datos
        </Text>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar />
      <TabsNavigator />
    </SafeAreaProvider>
  );
}

function TabsNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FAF9F5',
          borderBottomColor: '#E5E3E0',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1F1E1D',
        },
        tabBarStyle: {
          backgroundColor: '#FAF9F5',
          borderTopColor: '#E5E3E0',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8 + insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#6B6A68',
      }}
    >
      {SCREENS.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            headerTitle: screen.headerTitle,
            tabBarIcon: ({ color }) => <FontAwesome name={screen.icon} size={24} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
