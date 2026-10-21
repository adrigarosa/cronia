import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Alert, TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useTasks, useCategories } from '../hooks';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

type RecordType = 'task' | 'note' | 'event' | 'habit' | null;

export default function CreateScreen() {
  const [selectedType, setSelectedType] = useState<RecordType>(null);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { createNewTask } = useTasks();
  const { categories } = useCategories();

  const recordTypes = [
    { id: 'task', label: 'Tarea', icon: 'check-circle', description: 'Crear una nueva tarea' },
    { id: 'note', label: 'Nota', icon: 'sticky-note', description: 'Guardar una nota breve' },
    { id: 'event', label: 'Evento', icon: 'calendar', description: 'Agendar un evento' },
    { id: 'habit', label: 'Hábito', icon: 'repeat', description: 'Registrar un hábito' },
  ];

  const handleCreateTask = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Por favor ingresa una descripción');
      return;
    }

    try {
      setLoading(true);
      let dueDateTimestamp: number | undefined;
      
      if (dueDate.trim()) {
        const [day, month, year] = dueDate.split('/');
        if (day && month && year) {
          dueDateTimestamp = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          ).getTime();
        }
      }

      await createNewTask(description.trim(), dueDateTimestamp);
      setDescription('');
      setDueDate('');
      setSelectedType(null);
      router.back();
      Alert.alert('Exito', 'Tarea creada correctamente');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (selectedType === 'task') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Pressable onPress={() => setSelectedType(null)}>
              <FontAwesome name="arrow-left" size={24} color={colors.light.text} />
            </Pressable>
            <Text style={styles.title}>Crear Tarea</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Descripcion *</Text>
            <TextInput
              style={styles.input}
              placeholder="¿Que necesitas hacer?"
              value={description}
              onChangeText={setDescription}
              editable={!loading}
              placeholderTextColor={colors.light.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Vencimiento (opcional)</Text>
            <Text style={styles.hint}>Formato: DD/MM/YYYY</Text>
            <TextInput
              style={styles.input}
              placeholder="01/12/2026"
              value={dueDate}
              onChangeText={setDueDate}
              editable={!loading}
              placeholderTextColor={colors.light.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Crear Tarea"
              variant="primary"
              onPress={handleCreateTask}
              disabled={loading}
            />
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={() => setSelectedType(null)}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.mainTitle}>¿Que deseas crear?</Text>

        {recordTypes.map((type) => (
          <Pressable
            key={type.id}
            style={styles.typeCard}
            onPress={() => setSelectedType(type.id as RecordType)}
          >
            <FontAwesome name={type.icon as any} size={32} color={colors.light.primary} />
            <View style={styles.typeInfo}>
              <Text style={styles.typeLabel}>{type.label}</Text>
              <Text style={styles.typeDescription}>{type.description}</Text>
            </View>
            <FontAwesome name="chevron-right" size={20} color={colors.light.textSecondary} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.light.text,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.light.text,
    backgroundColor: colors.light.card,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderColor: colors.light.border,
    borderWidth: 1,
  },
  typeInfo: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
});
