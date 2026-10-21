/**
 * Sistema de Espaciado CRONIA
 * Sigue escala de 4px base para consistencia
 */

export const Spacing = {
  // Espacios base
  xs: 4,   // Extra pequeño
  sm: 8,   // Pequeño
  md: 16,  // Medio
  lg: 24,  // Grande
  xl: 32,  // Extra grande
  xxl: 48, // Doble extra grande

  // Alias comunes
  padding: 16,
  paddingSm: 8,
  paddingLg: 24,

  margin: 16,
  marginSm: 8,
  marginLg: 24,

  // Gaps (espacios entre elementos)
  gap: 16,
  gapSm: 8,
  gapLg: 24,

  // Border radius
  radius: 8,
  radiusSm: 4,
  radiusLg: 12,
  radiusXl: 16,

  // Heights
  touchableMinHeight: 48, // Altura mínima para elementos tocables
  headerHeight: 56,
  tabBarHeight: 60,

  // Line height (para tipografía)
  lineHeightSm: 1.2,
  lineHeightMd: 1.4,
  lineHeightLg: 1.6,
};

export const spacing = Spacing;
