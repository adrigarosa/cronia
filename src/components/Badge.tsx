import { StyleProp, Text, View, ViewStyle } from "react-native";
import { getBadgeContainerStyle, getBadgeTextStyle } from "../styles/components/Badge.styles";

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

export default function Badge({
  label,
  variant = "primary",
  size = "md",
  style,
}: Readonly<BadgeProps>) {
  return (
    <View style={[getBadgeContainerStyle(variant, size), style]}>
      <Text style={getBadgeTextStyle(size)}>
        {label}
      </Text>
    </View>
  );
}

export { Badge };
