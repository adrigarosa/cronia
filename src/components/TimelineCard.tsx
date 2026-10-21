import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors, getRecordTypeColor } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { TimelineItem } from '../utils/timeline';

const ICONS = {
  task: 'check-circle',
  note: 'sticky-note',
  event: 'calendar',
  habit: 'repeat',
} as const;

interface TimelineCardProps {
  item: TimelineItem;
  onPress?: (item: TimelineItem) => void;
  onLongPress?: (item: TimelineItem) => void;
  onComplete?: (item: TimelineItem) => void;
}

export function TimelineCard({ item, onPress, onLongPress, onComplete }: TimelineCardProps) {
  const color = getRecordTypeColor(item.kind);

  return (
    <Pressable
      style={[styles.container, { borderLeftColor: color }]}
      onPress={() => onPress?.(item)}
      onLongPress={() => onLongPress?.(item)}
    >
      <FontAwesome name={ICONS[item.kind]} size={20} color={color} />
      <View style={styles.body}>
        <Text style={[styles.title, item.done && styles.done]} numberOfLines={3}>
          {item.title}
        </Text>
        {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
      </View>
      {item.kind === 'task' && !item.done && onComplete ? (
        <Pressable style={styles.check} onPress={() => onComplete(item)} hitSlop={8}>
          <FontAwesome name="check" size={16} color="#FFFFFF" />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.light.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderLeftWidth: 4,
  },
  body: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: colors.light.text },
  done: { textDecorationLine: 'line-through', color: colors.light.textSecondary },
  subtitle: { fontSize: 13, color: colors.light.textSecondary, marginTop: 2 },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.success,
  },
});
