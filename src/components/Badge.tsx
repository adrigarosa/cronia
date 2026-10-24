import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  readonly label: string;
  readonly variant?: BadgeVariant;
  readonly size?: BadgeSize;
  readonly style?: StyleProp<ViewStyle>;
}

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

export default function Badge({
  label,
  variant = "primary",
  size = "md",
  style,
}: Readonly<BadgeProps>) {
  const { horizontal, vertical, fontSize } = sizeStyles[size];

  const containerStyle: ViewStyle = {
    backgroundColor: backgroundColors[variant],
    paddingHorizontal: horizontal,
    paddingVertical: vertical,
    borderRadius: Spacing.radiusSm,
    alignSelf: "flex-start",
  };

  return (
    <View style={[containerStyle, style]}>
      <Text style={{ color: "#fff", fontSize, fontWeight: "600" }}>
        {label}
      </Text>
    </View>
  );
}

export { Badge };
