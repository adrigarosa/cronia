import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  fullWidth = false,
  loading = false,
}: ButtonProps) {
  const getBackgroundColor = (): string => {
    if (disabled) return Colors.light.border;
    switch (variant) {
      case 'primary':
        return Colors.light.primary as string;
      case 'secondary':
        return Colors.light.card as string;
      case 'tertiary':
        return 'transparent';
      case 'danger':
        return Colors.light.danger as string;
      default:
        return Colors.light.primary as string;
    }
  };

  const getTextColor = (): string => {
    if (variant === 'secondary' || variant === 'tertiary') {
      return Colors.light.text as string;
    }
    return '#fff';
  };

  const getPadding = (): number => {
    switch (size) {
      case 'sm':
        return Spacing.sm;
      case 'md':
        return Spacing.md;
      case 'lg':
        return Spacing.lg;
      default:
        return Spacing.md;
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  const containerStyle: ViewStyle = {
    paddingVertical: getPadding(),
    paddingHorizontal: getPadding() * 1.5,
    borderRadius: Spacing.radius,
    backgroundColor: getBackgroundColor(),
    borderWidth: variant === 'secondary' ? 1 : 0,
    borderColor: variant === 'secondary' ? (Colors.light.border as string) : undefined,
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    minHeight: Spacing.touchableMinHeight,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle: TextStyle = {
    color: getTextColor(),
    fontSize: getTextSize(),
    fontWeight: '600',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        containerStyle,
        pressed && !disabled ? { opacity: 0.8 } : {},
        style,
      ]}
    >
      <Text style={textStyle}>
        {loading ? '...' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({});

export { Button };
