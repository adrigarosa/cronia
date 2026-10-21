import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTasks } from '../../hooks';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { Task } from '../../models';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const { tasks } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tasks && id) {
      const found = tasks.find((t) => t.id === id);
      setTask(found || null);
      setLoading(false);
    }
  }, [tasks, id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color={colors.light.text} />
          </Pressable>
          <Text style={styles.title}>Detalle</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>Registro no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOverdue = task.isOverdue();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color={colors.light.text} />
        </Pressable>
        <Text style={styles.title}>Detalle del Registro</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripcion</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado</Text>
          <Text style={[styles.status, isOverdue && styles.overdue]}>
            {task.status === 'completed' ? 'Completado' : task.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
          </Text>
        </View>

        {task.due_date && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vencimiento</Text>
            <Text style={[styles.dueDate, isOverdue && styles.overdueBad]}>
              {new Date(task.due_date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {isOverdue && ' (Vencido)'}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creado</Text>
          <Text style={styles.date}>
            {new Date(task.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {task.status !== 'completed' && (
            <Button
              label="Marcar como completado"
              variant="primary"
              onPress={() => {
                // TODO: Implementar completar
                router.back();
              }}
            />
          )}
          <Button
            label="Eliminar"
            variant="secondary"
            onPress={() => {
              // TODO: Implementar eliminar
              router.back();
            }}
          />
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomColor: colors.light.border,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.text,
    lineHeight: 24,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.primary,
    textTransform: 'capitalize',
  },
  overdue: {
    color: '#DC2626',
  },
  dueDate: {
    fontSize: 16,
    color: colors.light.text,
  },
  overdueBad: {
    color: '#DC2626',
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
});
