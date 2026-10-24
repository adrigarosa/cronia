import { useEffect, useMemo } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../constants/colors";

interface LoadingSpinnerProps {
  readonly size?: "sm" | "md" | "lg";
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
}

const spinnerSizes: Record<NonNullable<LoadingSpinnerProps["size"]>, number> = {
  sm: 24,
  md: 40,
  lg: 60,
};

export default function LoadingSpinner({
  size = "md",
  color = Colors.light.primary,
  style,
}: LoadingSpinnerProps) {
  const spinValue = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const diameter = spinnerSizes[size];

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: diameter,
            height: diameter,
            borderColor: color,
            borderRadius: diameter / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    borderWidth: 3,
    borderTopColor: "transparent",
  },
});

export { LoadingSpinner };
