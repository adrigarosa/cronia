/**
 * Modelo de Nota
 */

import { NoteClassification } from '../database/types';

export class Note {
  id: string;
  content: string;
  classification: NoteClassification;
  created_at: number;
  updated_at: number;
  categories: string[]; // IDs de categorías

  constructor(
    id: string,
    content: string,
    classification: NoteClassification,
    created_at: number,
    updated_at: number,
    categories: string[] = []
  ) {
    this.id = id;
    this.content = content;
    this.classification = classification;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.categories = categories;
  }

  /**
   * Obtener etiqueta amigable de clasificación
   */
  getClassificationLabel(): string {
    const labels: Record<NoteClassification, string> = {
      important: 'Importante',
      anecdote: 'Anécdota',
      reminder: 'Recordatorio',
      reflection: 'Reflexión',
    };
    return labels[this.classification];
  }

  /**
   * Verificar si la nota es importante
   */
  isImportant(): boolean {
    return this.classification === 'important';
  }

  /**
   * Obtener resumen de contenido (primeros 100 caracteres)
   */
  getSummary(): string {
    return this.content.substring(0, 100) + (this.content.length > 100 ? '...' : '');
  }
}
