/**
 * Modelo de Categoría
 */

export class Category {
  id: string;
  name: string;
  created_at: number;
  isDefault: boolean;

  constructor(
    id: string,
    name: string,
    created_at: number,
    isDefault: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.isDefault = isDefault;
  }

  /**
   * Categorías predeterminadas del sistema
   */
  static readonly DEFAULTS = {
    PERSONAL: 'personal',
    WORK: 'work',
    FAMILY: 'family',
    HOME: 'home',
    LEISURE: 'leisure',
    EXPENSES: 'expenses',
  } as const;

  /**
   * Nombres para las categorías predeterminadas
   */
  static readonly DEFAULT_NAMES: Record<string, string> = {
    personal: 'Personal',
    work: 'Laboral',
    family: 'Familiar',
    home: 'Hogar',
    leisure: 'Ocio',
    expenses: 'Gastos',
  };

  /**
   * Verificar si es una categoría predeterminada
   */
  static isDefaultCategory(id: string): boolean {
    return id in Category.DEFAULT_NAMES;
  }

  /**
   * Obtener nombre de categoría predeterminada
   */
  static getDefaultName(id: string): string | null {
    return Category.DEFAULT_NAMES[id] || null;
  }
}
