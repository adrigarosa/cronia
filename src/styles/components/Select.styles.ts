import { StyleSheet } from 'react-native';
import { fonts, Palette } from '../../theme/tokens';

export const makeStyles = (palette: Palette) =>
  StyleSheet.create({
    field: {
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.borderInput,
      backgroundColor: palette.surface,
      paddingHorizontal: 12,
      paddingRight: 34,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    value: { fontSize: 14, fontFamily: fonts.semibold, color: palette.ink, flexShrink: 1 },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    sheet: {
      width: '100%',
      maxWidth: 340,
      backgroundColor: palette.surface,
      borderRadius: 16,
      padding: 6,
    },
    row: {
      minHeight: 46,
      paddingHorizontal: 14,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    rowOn: { backgroundColor: palette.muted },
    rowText: { fontSize: 15, fontFamily: fonts.medium, color: palette.ink },
    rowTextOn: { fontFamily: fonts.bold },
  });
