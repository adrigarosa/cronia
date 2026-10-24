/**
 * Componente para mostrar un registro en la cronologia
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../models';
import { styles } from '../styles/components/RecordItem.styles';

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
