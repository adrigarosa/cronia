import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  pressable?: boolean;
}

export default function Card({
  children,
  onPress,
  style,
  variant = 'elevated',
  pressable = false,
}: CardProps) {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'outlined':
        return Colors.light.background as string;
      case 'filled':
        return Colors.light.card as string;
      case 'elevated':
      default:
        return Colors.light.card as string;
    }
  };

  const getBorderStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: Colors.light.border as string,
        };
      default:
        return {};
    }
  };

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: Spacing.radiusLg,
    padding: Spacing.md,
    ...getBorderStyle(),
  };

  const Component = pressable || !!onPress ? Pressable : View;

  return (
    <Component
      style={({ pressed }) => [
        containerStyle,
        pressed && (pressable || !!onPress) ? { opacity: 0.8 } : {},
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({});
