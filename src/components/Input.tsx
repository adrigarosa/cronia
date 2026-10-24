import React, { useState } from 'react';
import { TextInput, View, Text, ViewStyle, TextInputProps } from 'react-native';
import { Colors } from '../constants/colors';
import { styles } from '../styles/components/Input.styles';

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


export { Input };
