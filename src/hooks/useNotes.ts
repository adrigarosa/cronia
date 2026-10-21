/**
 * Hook personalizado para operaciones CRUD de notas
 */

import { useState, useCallback, useEffect } from 'react';
import { Note } from '../models';
import { NoteClassification } from '../database/types';
import { getNotes, createNote, updateNote, deleteNote } from '../database';
import { generateId } from '../utils/id';

interface UseNotesResult {
  notes: Note[];
  loading: boolean;
  error: string | null;
  createNewNote: (content: string, classification: NoteClassification) => Promise<void>;
  deleteExistingNote: (id: string) => Promise<void>;
  updateExistingNote: (id: string, updates: Partial<Pick<Note, 'content' | 'classification'>>) => Promise<void>;
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
      const rows = await getNotes();
      setNotes(
        rows.map((n) => new Note(n.id, n.content, n.classification, n.created_at, n.updated_at, []))
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewNote = useCallback(
    async (content: string, classification: NoteClassification) => {
      try {
        setError(null);
        await createNote(generateId(), content, classification);
        await refreshNotes();
      } catch (err) {
        setError((err as Error).message);
        throw err;
      }
    },
    [refreshNotes]
  );

  const deleteExistingNote = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await deleteNote(id);
        await refreshNotes();
      } catch (err) {
        setError((err as Error).message);
        throw err;
      }
    },
    [refreshNotes]
  );

  const updateExistingNote = useCallback(
    async (id: string, updates: Partial<Pick<Note, 'content' | 'classification'>>) => {
      try {
        setError(null);
        await updateNote(id, updates);
        await refreshNotes();
      } catch (err) {
        setError((err as Error).message);
        throw err;
      }
    },
    [refreshNotes]
  );

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
