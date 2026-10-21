import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks, useStats } from '../hooks';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

type PeriodType = 'day' | 'week' | 'month' | 'year';

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const { tasks, loading } = useTasks();
  const { taskStats, tasksByCategory, tasksByStatus } = useStats(tasks);

  const periods: { id: PeriodType; label: string }[] = [
    { id: 'day', label: 'Dia' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'year', label: 'Ano' },
  ];

  if (loading && tasks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estadisticas</Text>
      </View>

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
        {/* Resumen General */}
        <Text style={styles.sectionTitle}>Resumen General</Text>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Total de Tareas</Text>
            <Text style={styles.statValue}>{taskStats.total}</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Tasa de Completitud</Text>
            <Text style={[styles.statValue, { color: taskStats.completionRate > 70 ? '#10B981' : colors.light.primary }]}>
              {taskStats.completionRate}%
            </Text>
          </Card>
        </View>

        {/* Distribucion de Estado */}
        <Text style={styles.sectionTitle}>Distribucion por Estado</Text>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Completadas</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{taskStats.completed}</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>En Progreso</Text>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{taskStats.inProgress}</Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Pendientes</Text>
            <Text style={[styles.statValue, { color: '#6B7280' }]}>{taskStats.pending}</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Vencidas</Text>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{taskStats.overdue}</Text>
          </Card>
        </View>

        {/* Metricas Importantes */}
        <Text style={styles.sectionTitle}>Metricas Importantes</Text>

        <Card style={styles.largeStatCard}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Promedio de Dias para Completar</Text>
            <Text style={styles.metricValue}>{taskStats.avgCompletionDays} dias</Text>
          </View>
        </Card>

        {/* Por Categoria */}
        {Object.keys(tasksByCategory).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Por Categoria</Text>
            {Object.entries(tasksByCategory).map(([categoryId, count]) => (
              <Card key={categoryId} style={styles.categoryCard}>
                <View style={styles.categoryRow}>
                  <Text style={styles.categoryName}>{categoryId}</Text>
                  <Text style={styles.categoryCount}>{count} tareas</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Distribucion de Estado Detallada */}
        <Text style={styles.sectionTitle}>Distribucion Detallada</Text>
        <Card style={styles.largeStatCard}>
          <View style={styles.detailedStats}>
            <View style={styles.detailedRow}>
              <Text style={styles.detailedLabel}>Pendientes</Text>
              <Text style={styles.detailedPercent}>
                {taskStats.total > 0
                  ? Math.round((taskStats.pending / taskStats.total) * 100)
                  : 0}
                %
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      taskStats.total > 0
                        ? `${Math.round((taskStats.pending / taskStats.total) * 100)}%`
                        : '0%',
                    backgroundColor: '#6B7280',
                  },
                ]}
              />
            </View>

            <View style={[styles.detailedRow, styles.detailedRowMargin]}>
              <Text style={styles.detailedLabel}>En Progreso</Text>
              <Text style={styles.detailedPercent}>
                {taskStats.total > 0
                  ? Math.round((taskStats.inProgress / taskStats.total) * 100)
                  : 0}
                %
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      taskStats.total > 0
                        ? `${Math.round((taskStats.inProgress / taskStats.total) * 100)}%`
                        : '0%',
                    backgroundColor: '#F59E0B',
                  },
                ]}
              />
            </View>

            <View style={[styles.detailedRow, styles.detailedRowMargin]}>
              <Text style={styles.detailedLabel}>Completadas</Text>
              <Text style={styles.detailedPercent}>
                {taskStats.total > 0
                  ? Math.round((taskStats.completed / taskStats.total) * 100)
                  : 0}
                %
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      taskStats.total > 0
                        ? `${Math.round((taskStats.completed / taskStats.total) * 100)}%`
                        : '0%',
                    backgroundColor: '#10B981',
                  },
                ]}
              />
            </View>
          </View>
        </Card>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.light.border,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.light.card,
    borderColor: colors.light.border,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  largeStatCard: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  statLabel: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.light.primary,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: colors.light.text,
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.primary,
  },
  categoryCard: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    textTransform: 'capitalize',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.primary,
  },
  detailedStats: {
    gap: spacing.md,
  },
  detailedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailedRowMargin: {
    marginTop: spacing.md,
  },
  detailedLabel: {
    fontSize: 14,
    color: colors.light.text,
    fontWeight: '600',
  },
  detailedPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.light.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
