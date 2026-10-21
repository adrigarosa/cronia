import { useCallback } from 'react';
import { createHabit, deleteHabit } from '../database';
import { generateId } from '../utils/id';

export function useHabits() {
  const createNewHabit = useCallback(async (name: string, startDate: number = Date.now()) => {
    await createHabit(generateId(), name, startDate);
  }, []);

  const deleteExistingHabit = useCallback(async (id: string) => {
    await deleteHabit(id);
  }, []);

  return { createNewHabit, deleteExistingHabit };
}
