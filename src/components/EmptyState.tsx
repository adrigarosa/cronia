import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <FontAwesome
        name={icon as any}
        size={48}
        color={Colors.light.textSecondary as string}
        style={styles.icon}
      />

      <Text style={styles.title}>{title}</Text>

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {actionLabel && onAction && (
        <View style={styles.actionButton}>
          <Text
            style={styles.actionLabel}
            onPress={onAction}
          >
            {actionLabel}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text as string,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary as string,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: Spacing.md,
  },
  actionLabel: {
    color: Colors.light.primary as string,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export { EmptyState };
