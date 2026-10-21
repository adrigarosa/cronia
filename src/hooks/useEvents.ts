import { useCallback } from 'react';
import { createEvent, deleteEvent } from '../database';
import { generateId } from '../utils/id';

export interface NewEventInput {
  description: string;
  date: number;
  startTime: string;
  endTime: string;
  location?: string;
}

export function useEvents() {
  const createNewEvent = useCallback(async (input: NewEventInput) => {
    await createEvent(
      generateId(),
      input.description,
      input.date,
      input.startTime,
      input.date,
      input.endTime,
      'upcoming',
      input.location
    );
  }, []);

  const deleteExistingEvent = useCallback(async (id: string) => {
    await deleteEvent(id);
  }, []);

  return { createNewEvent, deleteExistingEvent };
}
