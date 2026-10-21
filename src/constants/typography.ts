/**
 * Sistema de Tipografía CRONIA
 * Basado en: Plus Jakarta Sans y Sora
 */

export const Typography = {
  // Fuentes
  fontFamily: {
    regular: 'System', // Fallback a fuente del sistema
    plusJakarta: 'Plus Jakarta Sans',
    sora: 'Sora',
  },

  // Estilos de texto
  heading1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  heading2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  heading3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  heading4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  heading5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  heading6: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },

  // Body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
  },

  // Labels y captions
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 16,
  },

  // Caption
  captionLarge: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  captionSmall: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
};

// Pesos de fuente
export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
