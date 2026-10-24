import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text as string,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary as string,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: Spacing.md,
  },
  actionLabel: {
    color: Colors.light.primary as string,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
