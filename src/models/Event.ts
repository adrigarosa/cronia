/**
 * Modelo de Evento/Cita
 */

import { EventStatus } from '../database/types';

export class Event {
  id: string;
  description: string;
  start_date: number;
  start_time: string;
  end_date: number;
  end_time: string;
  location?: string;
  status: EventStatus;
  created_at: number;
  updated_at: number;
  categories: string[]; // IDs de categorías

  constructor(
    id: string,
    description: string,
    start_date: number,
    start_time: string,
    end_date: number,
    end_time: string,
    created_at: number,
    updated_at: number,
    categories: string[] = [],
    status: EventStatus = 'upcoming',
    location?: string
  ) {
    this.id = id;
    this.description = description;
    this.start_date = start_date;
    this.start_time = start_time;
    this.end_date = end_date;
    this.end_time = end_time;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.categories = categories;
    this.status = status;
    this.location = location;
  }

  /**
   * Verificar si el evento está en el futuro
   */
  isUpcoming(): boolean {
    const now = Date.now();
    return this.start_date > now;
  }

  /**
   * Verificar si el evento está en progreso
   */
  isInProgress(): boolean {
    const now = Date.now();
    return this.start_date <= now && this.end_date >= now;
  }

  /**
   * Verificar si el evento ha pasado
   */
  isPast(): boolean {
    const now = Date.now();
    return this.end_date < now;
  }

  /**
   * Obtener duración en minutos
   */
  getDurationMinutes(): number {
    // Convertir tiempo a minutos desde medianoche
    const [startH, startM] = this.start_time.split(':').map(Number);
    const [endH, endM] = this.end_time.split(':').map(Number);

    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;

    // Si el evento se extiende al día siguiente
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }

    return endMinutes - startMinutes;
  }

  /**
   * Marcar evento como completado
   */
  markCompleted(): void {
    this.status = 'completed';
    this.updated_at = Date.now();
  }

  /**
   * Marcar evento como cancelado
   */
  markCancelled(): void {
    this.status = 'cancelled';
    this.updated_at = Date.now();
  }
}
