/**
 * Exportar todas las funciones y tipos de la base de datos
 */

export * from './types';
export * from './schema';
export { getDatabase, initializeDatabase, query, queryOne, execute, transaction, clearDatabase, closeDatabase } from './db';
export { createTask, getTask, getTasks, getTasksByStatus, updateTask, completeTask, deleteTask, countTasksByStatus, getOverdueTasks } from './tasks';
export { createCategory, getCategoryById, getCategories, getCategoriesByName, updateCategory, deleteCategory, countCategories, categoryExists } from './categories';
export { createNote, getNote, getNotes, getNotesByClassification, updateNote, deleteNote, countNotes, searchNotes } from './notes';
export { createEvent, getEvent, getEvents, getEventsByDateRange, getUpcomingEvents, updateEvent, deleteEvent, countEvents } from './events';
