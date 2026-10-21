/**
 * Sistema de Colores CRONIA
 * Basado en el diseño especificado en CRONIA - diseño definitivo.html
 * Soporta tema claro y oscuro
 */

export const Colors = {
  light: {
    // Colores primarios
    primary: '#8B5CF6', // Morado principal
    primaryDark: '#7C3AED', // Morado oscuro
    primaryLight: '#A78BFA', // Morado claro

    // Fondos
    background: '#FAF9F5', // Fondo principal claro (beige muy claro)
    card: '#FFFFFF', // Tarjetas blancas
    cardHover: '#F9F8F5', // Tarjetas hover

    // Textos
    text: '#1F1E1D', // Texto principal oscuro
    textSecondary: '#6B6A68', // Texto secundario
    textTertiary: '#A09F9D', // Texto terciario

    // Bordes y divisiones
    border: '#E5E3E0', // Bordes claros
    borderDark: '#D8D6D3', // Bordes más oscuros

    // Estados y acciones
    success: '#10B981', // Verde éxito
    warning: '#F59E0B', // Naranja advertencia
    danger: '#EF4444', // Rojo peligro
    info: '#3B82F6', // Azul información

    // Categorías (con colores suaves)
    categoryPersonal: '#EC4899', // Rosa
    categoryLaboral: '#0EA5E9', // Azul cielo
    categoryFamiliar: '#06B6D4', // Cyan
    categoryHogar: '#F97316', // Naranja
    categoryOcio: '#6366F1', // Índigo
    categoryGastos: '#84CC16', // Lima

    // Overlay y transparencias
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },

  dark: {
    // Colores primarios (adaptados para modo oscuro)
    primary: '#A78BFA',
    primaryDark: '#8B5CF6',
    primaryLight: '#C4B5FD',

    // Fondos
    background: '#1F1E1D', // Fondo principal oscuro
    card: '#2D2C2A', // Tarjetas oscuras
    cardHover: '#3A3A37', // Tarjetas hover

    // Textos
    text: '#FAF9F5', // Texto principal claro
    textSecondary: '#A09F9D', // Texto secundario
    textTertiary: '#6B6A68', // Texto terciario

    // Bordes y divisiones
    border: '#3A3A37', // Bordes oscuros
    borderDark: '#2D2C2A', // Bordes más oscuros

    // Estados y acciones (adaptados)
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',

    // Categorías (versión oscura)
    categoryPersonal: '#EC4899',
    categoryLaboral: '#0EA5E9',
    categoryFamiliar: '#06B6D4',
    categoryHogar: '#F97316',
    categoryOcio: '#6366F1',
    categoryGastos: '#84CC16',

    // Overlay y transparencias
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(255, 255, 255, 0.1)',
  },
};

/**
 * Obtener color de categoría por nombre
 */
export function getCategoryColor(categoryName: string): string {
  const colorKey = (`category${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}`) as keyof typeof Colors.light;
  return Colors.light[colorKey] || Colors.light.primary;
}

/**
 * Obtener color por tipo de registro
 */
export function getRecordTypeColor(type: 'task' | 'note' | 'event' | 'habit'): string {
  const colors: Record<string, string> = {
    task: '#0EA5E9', // Azul
    note: '#F59E0B', // Naranja
    event: '#EC4899', // Rosa
    habit: '#10B981', // Verde
  };
  return colors[type] || Colors.light.primary;
}

export const colors = Colors;
