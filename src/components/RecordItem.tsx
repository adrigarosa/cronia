/**
 * Componente para mostrar un registro en la cronologia
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { Task } from '../models';

interface RecordItemProps {
  record: Task;
  onPress?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export const RecordItem: React.FC<RecordItemProps> = ({ record, onPress, onComplete }) => {
  const isOverdue = record.isOverdue();
  const isPending = record.isPending();

  const handleComplete = () => {
    if (onComplete) {
      onComplete(record.id);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(record.id);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isOverdue && styles.overdue]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.description}>{record.description}</Text>
        {isPending && (
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleComplete}
          >
            <Text style={styles.checkIcon}>✓</Text>
          </TouchableOpacity>
        )}
      </View>

      {record.due_date && (
        <Text style={[styles.dueDate, isOverdue && styles.overdueDateText]}>
          Vencimiento: {new Date(record.due_date).toLocaleDateString('es-ES')}
        </Text>
      )}

      <Text style={styles.status}>{record.status}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.light.card,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.primary,
  },
  overdue: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  overdueDateText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: colors.light.textSecondary,
    textTransform: 'capitalize',
  },
});
