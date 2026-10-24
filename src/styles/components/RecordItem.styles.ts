import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.light.card,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.light.primary,
  },
  overdue: {
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  overdueDateText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: colors.light.textSecondary,
    textTransform: 'capitalize',
  },
});
