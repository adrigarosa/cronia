import { ViewStyle } from "react-native";
import { Colors } from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

export type CardVariant = "elevated" | "outlined" | "filled";

const backgroundColors: Record<CardVariant, string> = {
  elevated: Colors.light.card,
  outlined: Colors.light.background,
  filled: Colors.light.card,
};

export function getCardContainerStyle(variant: CardVariant): ViewStyle {
  return {
    backgroundColor: backgroundColors[variant],
    borderRadius: Spacing.radiusLg,
    padding: Spacing.md,
    ...(variant === "outlined"
      ? { borderWidth: 1, borderColor: Colors.light.border }
      : {}),
  };
}
