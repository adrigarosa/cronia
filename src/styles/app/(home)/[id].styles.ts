import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { spacing } from '../../../constants/spacing';

export const makeStyles = (colors: { light: typeof Colors.light }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.light.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomColor: colors.light.border,
      borderBottomWidth: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.light.text,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.light.textSecondary,
      textTransform: "uppercase",
      marginBottom: spacing.sm,
      letterSpacing: 0.5,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    editButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.light.primary,
    },
    editBox: {
      gap: spacing.md,
    },
    editInputWrap: {
      gap: 0,
    },
    editInput: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.light.text,
      borderWidth: 1,
      borderColor: colors.light.border,
      borderRadius: 12,
      padding: spacing.md,
      minHeight: 56,
      textAlignVertical: "top",
    },
    editIcons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 6,
      marginTop: 6,
    },
    editIconBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.light.background,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    description: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.light.text,
      lineHeight: 24,
    },
    status: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.light.primary,
      textTransform: "capitalize",
    },
    overdue: {
      color: "#DC2626",
    },
    dueDate: {
      fontSize: 16,
      color: colors.light.text,
    },
    overdueBad: {
      color: "#DC2626",
      fontWeight: "600",
    },
    dateRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    dateChip: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.light.border,
      backgroundColor: colors.light.background,
    },
    dateChipText: {
      fontSize: 15,
      color: colors.light.text,
    },
    date: {
      fontSize: 14,
      color: colors.light.textSecondary,
    },
    buttonContainer: {
      marginTop: spacing.xl,
      gap: spacing.md,
    },
    errorText: {
      fontSize: 16,
      color: "#EF4444",
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      padding: spacing.lg,
    },
    sheet: {
      backgroundColor: colors.light.card,
      borderRadius: 16,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.light.text,
    },
    sheetText: {
      fontSize: 14,
      color: colors.light.textSecondary,
      marginBottom: spacing.sm,
    },
    sheetOption: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    sheetOptionText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.light.text,
    },
    sheetDanger: {
      fontSize: 16,
      fontWeight: "600",
      color: "#DC2626",
    },
    sheetCancel: {
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    sheetCancelText: {
      fontSize: 16,
      color: colors.light.textSecondary,
    },
    catsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    catChip: {
      height: 40,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.light.border,
      backgroundColor: colors.light.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    catChipOn: {
      backgroundColor: colors.light.primary,
      borderColor: colors.light.primary,
    },
    catText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.light.text,
    },
    catTextOn: {
      color: "#FFFFFF",
    },
    newCatRow: {
      flexDirection: "row",
      gap: spacing.sm,
      alignItems: "center",
    },
    newCatInput: {
      height: 40,
      minWidth: 140,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.light.border,
      fontSize: 14,
      color: colors.light.text,
    },
  });
