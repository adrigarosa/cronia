import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle, TextStyle } from 'react-native';
import { Spacing } from '../constants/spacing';
import { useThemeColors } from '../theme/AppearanceContext';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  loading?: boolean;
}

const buttonPadding: Record<ButtonSize, number> = {
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
};

const textSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  fullWidth = false,
  loading = false,
}: Readonly<ButtonProps>) {
  const C = useThemeColors();

  const backgroundColors: Record<ButtonVariant, string> = {
    primary: C.primary,
    secondary: C.card,
    tertiary: 'transparent',
    danger: C.danger,
  };

  const padding = buttonPadding[size];
  const isTextButton = variant === 'secondary' || variant === 'tertiary';

  const containerStyle: ViewStyle = {
    paddingVertical: padding,
    paddingHorizontal: padding * 1.5,
    borderRadius: Spacing.radius,
    backgroundColor: disabled ? C.border : backgroundColors[variant],
    borderWidth: variant === 'secondary' ? 1 : 0,
    borderColor: variant === 'secondary' ? C.border : undefined,
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    minHeight: Spacing.touchableMinHeight,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle: TextStyle = {
    color: isTextButton ? C.text : '#fff',
    fontSize: textSizes[size],
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

export { Button };
