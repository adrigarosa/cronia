import { TextStyle, ViewStyle } from "react-native";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import type { BadgeSize, BadgeVariant } from "../../components/Badge";

const backgroundColors: Record<BadgeVariant, string> = {
  primary: Colors.light.primary,
  success: Colors.light.success,
  warning: Colors.light.warning,
  danger: Colors.light.danger,
  info: Colors.light.info,
};

const sizeStyles: Record<
  BadgeSize,
  { readonly horizontal: number; readonly vertical: number; readonly fontSize: number }
> = {
  sm: { horizontal: Spacing.sm, vertical: Spacing.xs, fontSize: 11 },
  md: { horizontal: Spacing.md, vertical: Spacing.sm, fontSize: 12 },
  lg: { horizontal: Spacing.lg, vertical: Spacing.md, fontSize: 14 },
};

export function getBadgeContainerStyle(variant: BadgeVariant, size: BadgeSize): ViewStyle {
  const { horizontal, vertical } = sizeStyles[size];

  return {
    backgroundColor: backgroundColors[variant],
    paddingHorizontal: horizontal,
    paddingVertical: vertical,
    borderRadius: Spacing.radiusSm,
    alignSelf: "flex-start",
  };
}

export function getBadgeTextStyle(size: BadgeSize): TextStyle {
  return { color: "#fff", fontSize: sizeStyles[size].fontSize, fontWeight: "600" };
}
