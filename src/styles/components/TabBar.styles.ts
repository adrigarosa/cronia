import { StyleSheet } from 'react-native';
import { fonts, Palette } from '../../theme/tokens';

export const makeStyles = (palette: Palette) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: palette.surface,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    pill: {
      width: 56,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pillOn: {
      backgroundColor: palette.navPill,
    },
    label: {
      fontSize: 12,
      fontFamily: fonts.medium,
    },
  });
