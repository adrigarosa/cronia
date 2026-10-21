/**
 * Servicio de inicialización de la base de datos
 * Maneja el setup y estado de la base de datos
 */

import { initializeDatabase } from '../database';

let isInitialized = false;
let initError: Error | null = null;

/**
 * Inicializar la base de datos (solo una vez)
 * Debe llamarse en el arranque de la aplicación
 */
export async function initDB(): Promise<void> {
  if (isInitialized) {
    console.log('ℹ️ Base de datos ya inicializada');
    return;
  }

  if (initError) {
    throw initError;
  }

  try {
    console.log('🔄 Inicializando base de datos...');
    await initializeDatabase();
    isInitialized = true;
    console.log('✅ Base de datos inicializada exitosamente');
  } catch (error) {
    initError = error as Error;
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

/**
 * Verificar si la base de datos está inicializada
 */
export function isDBInitialized(): boolean {
  return isInitialized;
}

/**
 * Resetear el estado (para testing)
 */
export function resetInitState(): void {
  isInitialized = false;
  initError = null;
}
