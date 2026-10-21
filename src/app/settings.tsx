import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Apariencia</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Tema oscuro</Text>
          <Text style={styles.settingDescription}>Activar modo nocturno</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
        />
      </View>

      <Text style={styles.sectionTitle}>Notificaciones</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Recordatorios</Text>
          <Text style={styles.settingDescription}>Notificaciones de tareas y eventos</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
        />
      </View>

      <Text style={styles.sectionTitle}>Datos</Text>

      <Pressable style={styles.actionRow}>
        <FontAwesome name="download" size={20} color={Colors.light.primary} />
        <Text style={styles.actionLabel}>Descargar copia de seguridad</Text>
      </Pressable>

      <Pressable style={styles.actionRow}>
        <FontAwesome name="upload" size={20} color={Colors.light.primary} />
        <Text style={styles.actionLabel}>Restaurar copia de seguridad</Text>
      </Pressable>

      <Pressable style={[styles.actionRow, styles.dangerRow]}>
        <FontAwesome name="trash" size={20} color="#d32f2f" />
        <Text style={[styles.actionLabel, styles.dangerText]}>Eliminar todos los datos</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Información</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Versión</Text>
        <Text style={styles.infoValue}>1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 12,
    borderColor: Colors.light.border,
    borderWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 12,
    borderColor: Colors.light.border,
    borderWidth: 1,
  },
  dangerRow: {
    borderColor: '#ffebee',
    backgroundColor: '#fff5f5',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginLeft: Spacing.md,
  },
  dangerText: {
    color: '#d32f2f',
  },
  infoCard: {
    backgroundColor: Colors.light.card,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 12,
    borderColor: Colors.light.border,
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
});
