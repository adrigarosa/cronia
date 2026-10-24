import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export const styles = StyleSheet.create({
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
