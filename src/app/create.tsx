import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

type RecordType = 'task' | 'note' | 'event' | 'habit' | null;

export default function CreateScreen() {
  const [selectedType, setSelectedType] = useState<RecordType>(null);

  const recordTypes = [
    { id: 'task', label: 'Tarea', icon: 'check-circle', description: 'Crear una nueva tarea' },
    { id: 'note', label: 'Nota', icon: 'sticky-note', description: 'Guardar una nota breve' },
    { id: 'event', label: 'Evento', icon: 'calendar', description: 'Agendar un evento' },
    { id: 'habit', label: 'Hábito', icon: 'repeat', description: 'Registrar un hábito' },
  ];

  if (selectedType) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crear {recordTypes.find(t => t.id === selectedType)?.label}</Text>
        <Text style={styles.placeholder}>Formulario de {selectedType} (próximamente)</Text>
        <Pressable
          style={styles.backButton}
          onPress={() => setSelectedType(null)}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¿Qué deseas crear?</Text>

      {recordTypes.map((type) => (
        <Pressable
          key={type.id}
          style={styles.typeCard}
          onPress={() => setSelectedType(type.id as RecordType)}
        >
          <FontAwesome name={type.icon as any} size={32} color={Colors.light.primary} />
          <View style={styles.typeInfo}>
            <Text style={styles.typeLabel}>{type.label}</Text>
            <Text style={styles.typeDescription}>{type.description}</Text>
          </View>
          <FontAwesome name="chevron-right" size={20} color={Colors.light.textSecondary} />
        </Pressable>
      ))}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 12,
    borderColor: Colors.light.border,
    borderWidth: 1,
  },
  typeInfo: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
});
