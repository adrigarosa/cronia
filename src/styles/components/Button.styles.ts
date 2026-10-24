import { TextStyle, ViewStyle } from 'react-native';
import { Spacing } from '../../constants/spacing';
import type { ButtonSize, ButtonVariant } from '../../components/Button';

interface ButtonColors {
  primary: string;
  card: string;
  border: string;
  danger: string;
  text: string;
}

interface ButtonStyleOptions {
  variant: ButtonVariant;
  size: ButtonSize;
  colors: ButtonColors;
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

export function getButtonContainerStyle({
  variant,
  size,
  disabled,
  fullWidth,
  colors: C,
}: ButtonStyleOptions & { disabled: boolean; fullWidth: boolean }): ViewStyle {
  const backgroundColors: Record<ButtonVariant, string> = {
    primary: C.primary,
    secondary: C.card,
    tertiary: 'transparent',
    danger: C.danger,
  };

  const padding = buttonPadding[size];

  return {
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
}

export function getButtonTextStyle({ variant, size, colors: C }: ButtonStyleOptions): TextStyle {
  const isTextButton = variant === 'secondary' || variant === 'tertiary';

  return {
    color: isTextButton ? C.text : '#fff',
    fontSize: textSizes[size],
    fontWeight: '600',
  };
}
