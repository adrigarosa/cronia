import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { useThemeColors } from '../theme/AppearanceContext';
import { getButtonContainerStyle, getButtonTextStyle } from '../styles/components/Button.styles';

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

  const containerStyle = getButtonContainerStyle({ variant, size, disabled, fullWidth, colors: C });
  const textStyle = getButtonTextStyle({ variant, size, colors: C });

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
