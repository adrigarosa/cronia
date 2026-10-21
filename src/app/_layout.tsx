import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <TabsNavigator />
    </SafeAreaProvider>
  );
}

function TabsNavigator() {
  return (
    <Tabs id="tabs">
      {/* HOME - Cronología */}
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Cronología',
          headerTitle: 'CRONIA',
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
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B6A68',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />

      {/* CREATE - Crear registro */}
      <Tabs.Screen
        name="create"
        options={{
          title: 'Crear',
          headerTitle: 'Nuevo registro',
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
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B6A68',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-circle" size={24} color={color} />
          ),
        }}
      />

      {/* SEARCH - Búsqueda y filtros */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          headerTitle: 'Búsqueda y filtros',
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
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B6A68',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />

      {/* STATS - Seguimiento */}
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Seguimiento',
          headerTitle: 'Estadísticas',
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
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B6A68',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart" size={24} color={color} />
          ),
        }}
      />

      {/* SETTINGS - Ajustes */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          headerTitle: 'Configuración',
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
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#6B6A68',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
