/**
 * Modelo de Hábito
 */

export class Habit {
  id: string;
  name: string;
  start_date: number;
  active: boolean;
  created_at: number;
  updated_at: number;
  categories: string[]; // IDs de categorías

  constructor(
    id: string,
    name: string,
    start_date: number,
    created_at: number,
    updated_at: number,
    categories: string[] = [],
    active: boolean = true
  ) {
    this.id = id;
    this.name = name;
    this.start_date = start_date;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.categories = categories;
    this.active = active;
  }

  /**
   * Activar hábito
   */
  activate(): void {
    this.active = true;
    this.updated_at = Date.now();
  }

  /**
   * Desactivar hábito
   */
  deactivate(): void {
    this.active = false;
    this.updated_at = Date.now();
  }

  /**
   * Obtener días desde el inicio del hábito
   */
  getDaysSinceStart(): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((Date.now() - this.start_date) / msPerDay);
  }

  /**
   * Verificar si el hábito tiene al menos X días
   */
  hasMinimumDays(days: number): boolean {
    return this.getDaysSinceStart() >= days;
  }

  /**
   * Obtener edad del hábito en formato legible
   */
  getAgeFormatted(): string {
    const days = this.getDaysSinceStart();
    if (days === 0) return 'Hoy';
    if (days === 1) return '1 día';
    if (days < 7) return `${days} días`;
    if (days < 30) return `${Math.floor(days / 7)} semanas`;
    if (days < 365) return `${Math.floor(days / 30)} meses`;
    return `${Math.floor(days / 365)} años`;
  }
}
