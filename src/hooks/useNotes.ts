import { withUpdates } from '../utils/clone';
/**
 * Hook personalizado para operaciones CRUD de notas
 */

import { useState, useCallback, useEffect } from 'react';
import { Note } from '../models';
import { generateId } from '../utils/id';

interface UseNotesResult {
  notes: Note[];
  loading: boolean;
  error: string | null;
  createNewNote: (content: string, classification: 'important' | 'anecdote' | 'reminder' | 'reflection', categoryId?: string) => Promise<void>;
  deleteExistingNote: (id: string) => Promise<void>;
  updateExistingNote: (id: string, updates: Partial<Note>) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

export function useNotes(): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implementar query de notas en database/notes.ts
      setNotes([]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewNote = useCallback(
    async (content: string, classification: 'important' | 'anecdote' | 'reminder' | 'reflection', categoryId?: string) => {
      try {
        setError(null);
        const id = generateId();
        const now = Date.now();
        const newNote = new Note(id, content, classification, now, now, categoryId ? [categoryId] : []);
        // TODO: Implementar createNote en database
        setNotes((prev) => [newNote, ...prev]);
      } catch (err) {
        setError((err as Error).message);
        throw err;
      }
    },
    []
  );

  const deleteExistingNote = useCallback(async (id: string) => {
    try {
      setError(null);
      // TODO: Implementar deleteNote en database
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const updateExistingNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      setError(null);
      // TODO: Implementar updateNote en database
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? withUpdates(note, { ...updates, updated_at: Date.now() }) : note
        )
      );
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshNotes();
  }, [refreshNotes]);

  return {
    notes,
    loading,
    error,
    createNewNote,
    deleteExistingNote,
    updateExistingNote,
    refreshNotes,
  };
}
