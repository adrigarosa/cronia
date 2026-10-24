import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import { styles } from '../styles/components/EmptyState.styles';

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


export { EmptyState };
