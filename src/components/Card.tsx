import type React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Colors } from "../constants/colors";
import { Spacing } from "../constants/spacing";

type CardVariant = "elevated" | "outlined" | "filled";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  pressable?: boolean;
}

const backgroundColors: Record<CardVariant, string> = {
  elevated: Colors.light.card,
  outlined: Colors.light.background,
  filled: Colors.light.card,
};

export default function Card({
  children,
  onPress,
  style,
  variant = "elevated",
  pressable = false,
}: Readonly<CardProps>) {
  const containerStyle: ViewStyle = {
    backgroundColor: backgroundColors[variant],
    borderRadius: Spacing.radiusLg,
    padding: Spacing.md,
    ...(variant === "outlined"
      ? { borderWidth: 1, borderColor: Colors.light.border }
      : {}),
  };

  if (pressable || onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          containerStyle,
          pressed ? { opacity: 0.8 } : {},
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
}

export { Card };
