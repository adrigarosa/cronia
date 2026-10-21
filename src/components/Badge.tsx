import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export default function Badge({
  label,
  variant = 'primary',
  size = 'md',
  style,
}: BadgeProps) {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'primary':
        return Colors.light.primary as string;
      case 'success':
        return Colors.light.success as string;
      case 'warning':
        return Colors.light.warning as string;
      case 'danger':
        return Colors.light.danger as string;
      case 'info':
        return Colors.light.info as string;
      default:
        return Colors.light.primary as string;
    }
  };

  const getPadding = (): { horizontal: number; vertical: number } => {
    switch (size) {
      case 'sm':
        return { horizontal: Spacing.sm, vertical: Spacing.xs };
      case 'md':
        return { horizontal: Spacing.md, vertical: Spacing.sm };
      case 'lg':
        return { horizontal: Spacing.lg, vertical: Spacing.md };
      default:
        return { horizontal: Spacing.md, vertical: Spacing.sm };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return 11;
      case 'md':
        return 12;
      case 'lg':
        return 14;
      default:
        return 12;
    }
  };

  const padding = getPadding();

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    paddingHorizontal: padding.horizontal,
    paddingVertical: padding.vertical,
    borderRadius: Spacing.radiusSm,
    alignSelf: 'flex-start',
  };

  return (
    <View style={[containerStyle, style]}>
      <Text
        style={{
          color: '#fff',
          fontSize: getFontSize(),
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
