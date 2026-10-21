export const palette = {
  bg: '#F6F5FA',
  surface: '#FFFFFF',
  ink: '#1C1B29',
  inkSoft: '#5E5C70',
  border: '#ECEAF2',
  borderInput: '#DAD8E3',
  borderChip: '#E2E0EA',
  borderLogo: '#E2E0EA',
  divider: '#F0EEF5',
  rowFooter: '#FBFAFD',
  muted: '#F2F1F6',
  mutedTile: '#EFEEF3',
  segmentTrack: '#ECEAF2',
  navPill: '#EDEBF4',
  switchOff: '#CFCCDA',
  dashed: '#B9B6C9',
  statusOpenBorder: '#CFCCDA',
  white: '#FFFFFF',
  dark: '#1C1B29',
  darkText: '#F6F5FA',
  error: '#B3261E',
} as const;

export const fonts = {
  body: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  display: 'Sora_600SemiBold',
  displayBold: 'Sora_700Bold',
} as const;

export type RecordKind = 'T' | 'E' | 'N' | 'H';

export interface TypeColors {
  base: string;
  dark: string;
  tint: string;
  mid: string;
  ring: string;
  dashed: string;
  label: string;
  plural: string;
}

export type ColorThemeId = 'cronia' | 'suave' | 'contraste';

export const LABELS: Record<RecordKind, { label: string; plural: string }> = {
  T: { label: 'Tarea', plural: 'Tareas' },
  E: { label: 'Cita', plural: 'Citas' },
  N: { label: 'Nota', plural: 'Notas' },
  H: { label: 'Hábito', plural: 'Hábitos' },
};

const CRONIA: Record<RecordKind, Omit<TypeColors, 'label' | 'plural'>> = {
  T: { base: '#2980B9', dark: '#1F618D', tint: '#EAF2F8', mid: '#1F618D', ring: '', dashed: '' },
  E: { base: '#9B59B6', dark: '#7D3C98', tint: '#F4ECF7', mid: '#8E4BAA', ring: '#E2CCEC', dashed: '#C9A3D8' },
  N: { base: '#16A085', dark: '#0E6655', tint: '#E8F6F3', mid: '#0E6655', ring: '', dashed: '' },
  H: { base: '#E67E22', dark: '#A04000', tint: '#FDF2E9', mid: '#D06A12', ring: '#F5D2B0', dashed: '#E9A66A' },
};

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const part = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return '#' + part(r) + part(g) + part(b);
}

export function mixColors(a: string, b: string, weightOfB: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(
    ar + (br - ar) * weightOfB,
    ag + (bg - ag) * weightOfB,
    ab + (bb - ab) * weightOfB
  );
}

const THEME_BASES: Record<ColorThemeId, [string, string, string, string]> = {
  cronia: ['#2980B9', '#9B59B6', '#16A085', '#E67E22'],
  suave: ['#6FA8DC', '#B48BC9', '#5FBFA8', '#F0A868'],
  contraste: ['#1F618D', '#7D3C98', '#0E6655', '#A04000'],
};

export const COLOR_THEMES: { id: ColorThemeId; label: string; swatches: string[] }[] = [
  { id: 'cronia', label: 'CRONIA', swatches: THEME_BASES.cronia },
  { id: 'suave', label: 'Suave', swatches: THEME_BASES.suave },
  { id: 'contraste', label: 'Contraste', swatches: THEME_BASES.contraste },
];

const KINDS: RecordKind[] = ['T', 'E', 'N', 'H'];

export function getTypePalette(theme: ColorThemeId): Record<RecordKind, TypeColors> {
  const out = {} as Record<RecordKind, TypeColors>;
  KINDS.forEach((kind, i) => {
    const info = LABELS[kind];
    if (theme === 'cronia') {
      const given = CRONIA[kind];
      out[kind] = {
        ...given,
        ring: given.ring || mixColors(given.base, '#FFFFFF', 0.7),
        dashed: given.dashed || mixColors(given.base, '#FFFFFF', 0.45),
        ...info,
      };
      return;
    }
    const base = THEME_BASES[theme][i];
    const dark = theme === 'contraste' ? base : mixColors(base, '#000000', 0.35);
    out[kind] = {
      base,
      dark,
      tint: mixColors(base, '#FFFFFF', 0.9),
      mid: mixColors(base, '#000000', 0.15),
      ring: mixColors(base, '#FFFFFF', 0.7),
      dashed: mixColors(base, '#FFFFFF', 0.45),
      ...info,
    };
  });
  return out;
}

export const radius = {
  chip: 8,
  input: 14,
  card: 18,
  section: 20,
  pill: 20,
  tile: 11,
} as const;
