/**
 * Utilidades de validación para CRONIA
 */

/**
 * Validar que una fecha es válida
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validar que una cadena no esté vacía
 */
export function isNonEmptyString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validar que una cadena tenga una longitud mínima
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * Validar que una cadena tenga una longitud máxima
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * Validar un correo electrónico
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar que una fecha de fin es después de la fecha de inicio
 */
export function isEndDateAfterStartDate(startDate: Date, endDate: Date): boolean {
  return endDate.getTime() > startDate.getTime();
}

/**
 * Validar que un número es positivo
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Validar que un ID no esté vacío
 */
export function isValidId(id: string): boolean {
  return isNonEmptyString(id);
}
