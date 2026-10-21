import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  maxLength?: number;
}

export default function Input({
  label,
  error,
  required = false,
  hint,
  containerStyle,
  multiline = false,
  maxLength,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? Colors.light.danger as string
    : isFocused
    ? (Colors.light.primary as string)
    : (Colors.light.border as string);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          {
            borderColor,
            color: Colors.light.text as string,
          },
        ]}
        placeholderTextColor={Colors.light.textSecondary as string}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!props.editable === false}
        multiline={multiline}
        maxLength={maxLength}
        {...props}
      />

      {hint && !error && (
        <Text style={styles.hint}>{hint}</Text>
      )}

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text as string,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.light.danger as string,
  },
  input: {
    backgroundColor: Colors.light.card as string,
    borderWidth: 1,
    borderColor: Colors.light.border as string,
    borderRadius: Spacing.radius,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    minHeight: Spacing.touchableMinHeight,
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: Spacing.md,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: Colors.light.textSecondary as string,
    marginTop: Spacing.sm,
  },
  error: {
    fontSize: 12,
    color: Colors.light.danger as string,
    marginTop: Spacing.sm,
  },
});

export { Input };
