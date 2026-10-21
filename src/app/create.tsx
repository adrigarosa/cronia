import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTasks, useNotes, useEvents, useHabits } from '../hooks';
import { Button } from '../components/Button';
import { NoteClassification } from '../database/types';
import { parseDate, parseTime } from '../utils/formParsers';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

type RecordType = 'task' | 'note' | 'event' | 'habit' | null;

const RECORD_TYPES = [
  { id: 'task', label: 'Tarea', icon: 'check-circle', description: 'Crear una nueva tarea' },
  { id: 'note', label: 'Nota', icon: 'sticky-note', description: 'Guardar una nota breve' },
  { id: 'event', label: 'Evento', icon: 'calendar', description: 'Agendar un evento' },
  { id: 'habit', label: 'Hábito', icon: 'repeat', description: 'Registrar un hábito' },
] as const;

const CLASSIFICATIONS: { id: NoteClassification; label: string }[] = [
  { id: 'reminder', label: 'Recordatorio' },
  { id: 'important', label: 'Importante' },
  { id: 'anecdote', label: 'Anécdota' },
  { id: 'reflection', label: 'Reflexión' },
];

const TITLES = {
  task: 'Crear Tarea',
  note: 'Crear Nota',
  event: 'Crear Evento',
  habit: 'Crear Hábito',
} as const;

export default function CreateScreen() {
  const router = useRouter();
  const { createNewTask } = useTasks();
  const { createNewNote } = useNotes();
  const { createNewEvent } = useEvents();
  const { createNewHabit } = useHabits();

  const [selectedType, setSelectedType] = useState<RecordType>(null);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [classification, setClassification] = useState<NoteClassification>('reminder');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  const resetForm = () => {
    setText('');
    setDate('');
    setClassification('reminder');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setSelectedType(null);
  };

  const fail = (message: string): null => {
    Alert.alert('Revisa el formulario', message);
    return null;
  };

  const validate = (): (() => Promise<void>) | null => {
    const value = text.trim();

    if (selectedType === 'task') {
      if (!value) return fail('Escribe una descripción.');
      let due: number | undefined;
      if (date.trim()) {
        const parsed = parseDate(date);
        if (parsed === null) return fail('La fecha debe tener formato DD/MM/AAAA y ser válida.');
        due = parsed;
      }
      return () => createNewTask(value, due);
    }

    if (selectedType === 'note') {
      if (!value) return fail('Escribe el contenido de la nota.');
      return () => createNewNote(value, classification);
    }

    if (selectedType === 'event') {
      if (!value) return fail('Escribe una descripción.');
      const day = parseDate(date);
      if (day === null) return fail('La fecha debe tener formato DD/MM/AAAA y ser válida.');
      const start = parseTime(startTime);
      const end = parseTime(endTime);
      if (!start || !end) return fail('Las horas deben tener formato HH:mm (por ejemplo 09:30).');
      if (end <= start) return fail('La hora de fin debe ser posterior a la de inicio.');
      const place = location.trim() || undefined;
      return () =>
        createNewEvent({ description: value, date: day, startTime: start, endTime: end, location: place });
    }

    if (selectedType === 'habit') {
      if (!value) return fail('Escribe el nombre del hábito.');
      let start = Date.now();
      if (date.trim()) {
        const parsed = parseDate(date);
        if (parsed === null) return fail('La fecha debe tener formato DD/MM/AAAA y ser válida.');
        start = parsed;
      }
      return () => createNewHabit(value, start);
    }

    return null;
  };

  const handleSubmit = async () => {
    const action = validate();
    if (!action) return;

    try {
      setLoading(true);
      await action();
      resetForm();
      router.navigate('/');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedType) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.mainTitle}>¿Qué deseas crear?</Text>

          {RECORD_TYPES.map((type) => (
            <Pressable key={type.id} style={styles.typeCard} onPress={() => setSelectedType(type.id)}>
              <FontAwesome name={type.icon} size={32} color={colors.light.primary} />
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

  const textLabel =
    selectedType === 'note' ? 'Contenido *' : selectedType === 'habit' ? 'Nombre *' : 'Descripción *';
  const textPlaceholder =
    selectedType === 'task'
      ? '¿Qué necesitas hacer?'
      : selectedType === 'note'
        ? 'Escribe tu nota...'
        : selectedType === 'event'
          ? '¿Qué vas a hacer?'
          : '¿Qué hábito quieres seguir?';
  const dateLabel =
    selectedType === 'task'
      ? 'Vencimiento (opcional)'
      : selectedType === 'event'
        ? 'Fecha *'
        : 'Fecha de inicio (opcional, por defecto hoy)';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable onPress={() => setSelectedType(null)} hitSlop={8}>
              <FontAwesome name="arrow-left" size={24} color={colors.light.text} />
            </Pressable>
            <Text style={styles.title}>{TITLES[selectedType]}</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{textLabel}</Text>
            <TextInput
              style={[styles.input, selectedType !== 'habit' && styles.multiline]}
              placeholder={textPlaceholder}
              value={text}
              onChangeText={setText}
              editable={!loading}
              placeholderTextColor={colors.light.textSecondary}
              multiline={selectedType !== 'habit'}
            />
          </View>

          {selectedType === 'note' && (
            <View style={styles.section}>
              <Text style={styles.label}>Clasificación</Text>
              <View style={styles.chips}>
                {CLASSIFICATIONS.map((c) => (
                  <Pressable
                    key={c.id}
                    style={[styles.chip, classification === c.id && styles.chipActive]}
                    onPress={() => setClassification(c.id)}
                  >
                    <Text style={[styles.chipText, classification === c.id && styles.chipTextActive]}>
                      {c.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {selectedType !== 'note' && (
            <View style={styles.section}>
              <Text style={styles.label}>{dateLabel}</Text>
              <Text style={styles.hint}>Formato: DD/MM/AAAA</Text>
              <TextInput
                style={styles.input}
                placeholder="01/12/2026"
                value={date}
                onChangeText={setDate}
                editable={!loading}
                placeholderTextColor={colors.light.textSecondary}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          )}

          {selectedType === 'event' && (
            <>
              <View style={styles.row}>
                <View style={[styles.section, styles.flex]}>
                  <Text style={styles.label}>Inicio *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="09:00"
                    value={startTime}
                    onChangeText={setStartTime}
                    editable={!loading}
                    placeholderTextColor={colors.light.textSecondary}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View style={[styles.section, styles.flex]}>
                  <Text style={styles.label}>Fin *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10:00"
                    value={endTime}
                    onChangeText={setEndTime}
                    editable={!loading}
                    placeholderTextColor={colors.light.textSecondary}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Lugar (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Oficina, casa, ..."
                  value={location}
                  onChangeText={setLocation}
                  editable={!loading}
                  placeholderTextColor={colors.light.textSecondary}
                />
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button label="Guardar" variant="primary" onPress={handleSubmit} disabled={loading} loading={loading} />
            <Button label="Cancelar" variant="secondary" onPress={resetForm} disabled={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
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
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.card,
  },
  chipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.light.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
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
