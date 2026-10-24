import type React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { CardVariant, getCardContainerStyle } from "../styles/components/Card.styles";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  pressable?: boolean;
}

export default function Card({
  children,
  onPress,
  style,
  variant = "elevated",
  pressable = false,
}: Readonly<CardProps>) {
  const containerStyle = getCardContainerStyle(variant);

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
