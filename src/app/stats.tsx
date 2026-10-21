import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

type PeriodType = 'day' | 'week' | 'month' | 'year';

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');

  const periods: { id: PeriodType; label: string }[] = [
    { id: 'day', label: 'Día' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'year', label: 'Año' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <Pressable
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.sectionTitle}>Tareas</Text>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completadas</Text>
          <Text style={styles.statValue}>0</Text>
        </View>

        <Text style={styles.sectionTitle}>Hábitos</Text>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Cumplimiento</Text>
          <Text style={styles.statValue}>0%</Text>
        </View>

        <Text style={styles.sectionTitle}>Eventos</Text>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Realizados</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomColor: Colors.light.border,
    borderBottomWidth: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.xs,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.border,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  statCard: {
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
