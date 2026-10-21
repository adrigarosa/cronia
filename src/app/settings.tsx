import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, SafeAreaView, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSettings } from '../hooks';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { settings, loading, updateSetting, resetSettings } = useSettings();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (loading || !settings) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const handleResetSettings = () => {
    Alert.alert(
      'Restablecer Configuracion',
      'Esto restablecera todas las opciones a sus valores predeterminados.',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Restablecer',
          onPress: async () => {
            try {
              await resetSettings();
              Alert.alert('Exito', 'Configuracion restablecida');
            } catch (err) {
              Alert.alert('Error', 'No se pudo restablecer la configuracion');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Datos',
      'La funcionalidad de exportacion estara disponible pronto.',
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Importar Datos',
      'La funcionalidad de importacion estara disponible pronto.',
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuracion</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Apariencia */}
        <Text style={styles.sectionTitle}>Apariencia</Text>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Tema</Text>
              <Text style={styles.settingDescription}>Selecciona el tema de la aplicacion</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {['light', 'dark', 'auto'].map((theme) => (
              <Pressable
                key={theme}
                style={[
                  styles.optionButton,
                  settings.theme === theme && styles.optionButtonActive,
                ]}
                onPress={() => updateSetting('theme', theme as 'light' | 'dark' | 'auto')}
              >
                <FontAwesome
                  name={settings.theme === theme ? 'check-circle' : 'circle-o'}
                  size={18}
                  color={colors.light.primary}
                />
                <Text
                  style={[
                    styles.optionText,
                    settings.theme === theme && styles.optionTextActive,
                  ]}
                >
                  {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : 'Automatico'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Formato y Regional */}
        <Text style={styles.sectionTitle}>Formato y Regional</Text>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Idioma</Text>
              <Text style={styles.settingDescription}>Selecciona el idioma de la aplicacion</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {['es', 'en'].map((lang) => (
              <Pressable
                key={lang}
                style={[
                  styles.optionButton,
                  settings.language === lang && styles.optionButtonActive,
                ]}
                onPress={() => updateSetting('language', lang as 'es' | 'en')}
              >
                <FontAwesome
                  name={settings.language === lang ? 'check-circle' : 'circle-o'}
                  size={18}
                  color={colors.light.primary}
                />
                <Text
                  style={[
                    styles.optionText,
                    settings.language === lang && styles.optionTextActive,
                  ]}
                >
                  {lang === 'es' ? 'Espanol' : 'English'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Formato de Fecha</Text>
              <Text style={styles.settingDescription}>Elige como mostrar las fechas</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map((format) => (
              <Pressable
                key={format}
                style={[
                  styles.optionButton,
                  settings.dateFormat === format && styles.optionButtonActive,
                ]}
                onPress={() =>
                  updateSetting('dateFormat', format as 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD')
                }
              >
                <FontAwesome
                  name={settings.dateFormat === format ? 'check-circle' : 'circle-o'}
                  size={18}
                  color={colors.light.primary}
                />
                <Text
                  style={[
                    styles.optionText,
                    settings.dateFormat === format && styles.optionTextActive,
                  ]}
                >
                  {format}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Notificaciones */}
        <Text style={styles.sectionTitle}>Notificaciones y Sonido</Text>

        <Card style={styles.settingCard}>
          <Pressable style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notificaciones</Text>
              <Text style={styles.settingDescription}>Activar notificaciones</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => updateSetting('notificationsEnabled', value)}
              trackColor={{ false: colors.light.border, true: colors.light.primary }}
              thumbColor={colors.light.primary}
            />
          </Pressable>

          <Pressable style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sonido</Text>
              <Text style={styles.settingDescription}>Activar sonido en notificaciones</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSetting('soundEnabled', value)}
              trackColor={{ false: colors.light.border, true: colors.light.primary }}
              thumbColor={colors.light.primary}
            />
          </Pressable>

          <Pressable style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vibracion</Text>
              <Text style={styles.settingDescription}>Activar vibracion en notificaciones</Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) => updateSetting('vibrationEnabled', value)}
              trackColor={{ false: colors.light.border, true: colors.light.primary }}
              thumbColor={colors.light.primary}
            />
          </Pressable>
        </Card>

        {/* Datos */}
        <Text style={styles.sectionTitle}>Datos y Copia de Seguridad</Text>

        <Card style={styles.settingCard}>
          <Pressable style={styles.actionRow} onPress={handleExportData}>
            <FontAwesome name="download" size={20} color={colors.light.primary} />
            <Text style={styles.actionLabel}>Exportar Datos</Text>
            <FontAwesome name="chevron-right" size={16} color={colors.light.textSecondary} />
          </Pressable>

          <Pressable style={styles.actionRow} onPress={handleImportData}>
            <FontAwesome name="upload" size={20} color={colors.light.primary} />
            <Text style={styles.actionLabel}>Importar Datos</Text>
            <FontAwesome name="chevron-right" size={16} color={colors.light.textSecondary} />
          </Pressable>
        </Card>

        {/* Informacion */}
        <Text style={styles.sectionTitle}>Informacion</Text>

        <Card style={styles.settingCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <Text style={styles.infoLabel}>Desarrollador</Text>
            <Text style={styles.infoValue}>Agrod</Text>
          </View>
        </Card>

        {/* Acciones */}
        <Text style={styles.sectionTitle}>Acciones</Text>

        <Button
          label="Restablecer Configuracion"
          variant="secondary"
          onPress={handleResetSettings}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.light.text,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.textSecondary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingCard: {
    marginBottom: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomColor: colors.light.border,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  optionsContainer: {
    paddingVertical: spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
    gap: spacing.md,
  },
  optionButtonActive: {
    backgroundColor: colors.light.primary + '10',
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
    color: colors.light.text,
  },
  optionTextActive: {
    fontWeight: '600',
    color: colors.light.primary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomColor: colors.light.border,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.light.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  borderTop: {
    borderTopColor: colors.light.border,
    borderTopWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
});
