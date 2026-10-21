# CRONIA - Arquitectura de Proyecto

## 📐 Estructura Layered

```
┌─────────────────────────────────────────────┐
│         EXPO ROUTER SCREENS                 │
│  (Home, Create, Search, Stats, Settings)   │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│         REACT COMPONENTS                    │
│  (Button, Card, Badge, Input, etc)         │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│     BUSINESS LOGIC LAYER                    │
│  (Task, Note, Event, Habit Models)         │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│         SERVICE LAYER                       │
│  (DatabaseService, CategorySeedService)    │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│    DATA ACCESS LAYER (SQLite)               │
│  (CRUD operations, Queries)                │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│    DATABASE (expo-sqlite)                   │
│  (8 tables, 6 default categories)          │
└─────────────────────────────────────────────┘
```

## 🗂️ Estructura de Directorios

```
src/
├── app/                          # Rutas Expo Router (pantallas)
│   ├── _layout.tsx              # Navigation master (5 tabs)
│   ├── (home)/
│   │   ├── _layout.tsx          # Stack layout
│   │   ├── index.tsx            # Cronología principal
│   │   └── [id].tsx             # Detalle de registro (modal)
│   ├── create.tsx               # Crear nuevo registro
│   ├── search.tsx               # Búsqueda y filtros
│   ├── stats.tsx                # Estadísticas
│   └── settings.tsx             # Configuración
│
├── components/                   # Componentes UI reutilizables
│   ├── Button.tsx               # Botón con variantes
│   ├── Input.tsx                # Input de texto
│   ├── Card.tsx                 # Contenedor de tarjeta
│   ├── Badge.tsx                # Etiquetas
│   ├── LoadingSpinner.tsx        # Indicador de carga
│   └── EmptyState.tsx           # Estado vacío
│
├── models/                       # Lógica de negocio
│   ├── Task.ts                  # Modelo de Tarea
│   ├── Note.ts                  # Modelo de Nota
│   ├── Event.ts                 # Modelo de Evento
│   ├── Habit.ts                 # Modelo de Hábito
│   └── Category.ts              # Modelo de Categoría
│
├── database/                     # Acceso a datos
│   ├── schema.ts                # Definición de tablas
│   ├── types.ts                 # Tipos TypeScript para BD
│   ├── db.ts                    # Gestor principal de BD
│   ├── tasks.ts                 # CRUD de tareas
│   ├── categories.ts            # CRUD de categorías
│   └── index.ts                 # Exportaciones centralizadas
│
├── services/                     # Lógica de aplicación
│   ├── DatabaseService.ts       # Inicialización de BD
│   ├── CategorySeedService.ts   # Seed de categorías
│   └── index.ts                 # Exportaciones centralizadas
│
├── constants/                    # Tokens de diseño
│   ├── colors.ts                # Paleta de colores
│   ├── spacing.ts               # Sistema de espaciado
│   └── typography.ts            # Estilos tipográficos
│
└── utils/                        # Utilidades
    ├── validators.ts            # Funciones de validación
    ├── colors.ts                # Helpers de color
    └── index.ts                 # Exportaciones centralizadas
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

```sql
-- Base unificada para todos los registros
categories (id TEXT, name TEXT, created_at INTEGER)

-- Registro base (herencia)
records (id TEXT, type TEXT, created_at INTEGER, updated_at INTEGER, deleted INTEGER)

-- Tipos específicos
tasks (id TEXT, description TEXT, due_date INTEGER, status TEXT, completed_at INTEGER)
notes (id TEXT, content TEXT, classification TEXT)
events (id TEXT, description TEXT, start_date INTEGER, start_time TEXT, end_date INTEGER, end_time TEXT, location TEXT, status TEXT)
habits (id TEXT, name TEXT, start_date INTEGER, active INTEGER)

-- Relaciones
record_categories (record_id TEXT, category_id TEXT)
habit_logs (id TEXT, habit_id TEXT, date TEXT, status TEXT, note TEXT, created_at INTEGER, updated_at INTEGER)
```

### Categorías Predeterminadas

1. **Personal** - Actividades personales
2. **Laboral** - Tareas de trabajo
3. **Familiar** - Asuntos familiares
4. **Hogar** - Tareas del hogar
5. **Ocio** - Actividades de ocio
6. **Gastos** - Registro de gastos

## 🧠 Modelos de Negocio

### Task
```typescript
- markComplete(): void
- markInProgress(): void
- isOverdue(): boolean
- isPending(): boolean
- getTimeRemaining(): number | null
```

### Note
```typescript
- getClassificationLabel(): string
- isImportant(): boolean
- getSummary(): string
```

### Event
```typescript
- isUpcoming(): boolean
- isInProgress(): boolean
- isPast(): boolean
- getDurationMinutes(): number
- markCompleted(): void
- markCancelled(): void
```

### Habit
```typescript
- activate(): void
- deactivate(): void
- getDaysSinceStart(): number
- hasMinimumDays(days: number): boolean
- getAgeFormatted(): string
```

## 🧪 Cobertura de Tests

| Capa | Tests | Status |
|------|-------|--------|
| Database Schema | 6 | ✅ |
| Database Types | 16 | ✅ |
| Database CRUD | 8 | ✅ |
| Models | 30 | ✅ |
| Services | 8 | ✅ |
| Utils | 28 | ✅ |
| Components | 4 | ⏳ |
| **Total** | **111** | **✅** |

## 🔄 Flujo de Datos

```
Usuario interactúa con Pantalla (src/app)
         ↓
Componente actualiza estado (src/components)
         ↓
Llamada a Service (src/services)
         ↓
Modelo aplica lógica (src/models)
         ↓
Acceso a BD (src/database)
         ↓
SQLite guarda datos (cronia.db)
         ↓
Actualización reactiva en UI
```

## 🚀 Operaciones Principales

### Crear Registro
1. Usuario llena formulario en `create.tsx`
2. Genera UUID para el registro
3. Instancia modelo (Task/Note/Event/Habit)
4. Llama a función CRUD (createTask, etc)
5. Inserta en records + tabla específica
6. Navega a home con actualización

### Listar Registros
1. Pantalla `(home)/index.tsx` carga registros
2. Llama `getTasks()` / `getCategories()`
3. Crea modelos desde datos de BD
4. Aplica filtros y ordenamiento
5. Renderiza con componentes

### Actualizar Registro
1. Abre detalle en `[id].tsx`
2. Edita propiedades del modelo
3. Llama `updateTask()` etc
4. Actualiza updated_at automáticamente
5. Refleja cambios en BD

### Eliminar Registro
1. Soft delete: `UPDATE records SET deleted = 1`
2. Mantiene historial
3. Excluye de consultas por defecto
4. Recuperable si es necesario

## 🔐 Transacciones

Usar `transaction()` para operaciones atómicas:
```typescript
await transaction([
  { sql: 'INSERT INTO records ...', params: [...] },
  { sql: 'INSERT INTO tasks ...', params: [...] }
]);
```

## 📊 Decisiones Arquitectónicas

1. **Soft Deletes**: No eliminar físicamente, marcar como deleted
2. **Tabla unificada**: Un records para todos los tipos
3. **Modelos ricos**: Lógica de negocio en clases TypeScript
4. **Lazy loading**: Cargar categorías al inicializar
5. **Tests aislados**: No conectar a BD real en tests
6. **Validaciones en modelo**: Cada modelo valida sus reglas

## 🔗 Dependencias Clave

```json
{
  "expo": "~58.0.16",
  "expo-router": "~58.0.24",
  "expo-sqlite": "^14.3.0",
  "react": "^19.3.0",
  "react-native": "^0.88.0",
  "typescript": "^6.0.3",
  "vitest": "^5.0.5"
}
```

## ✅ Checklist de Completitud Phase 1

- [x] 1.1 Setup Inicial (Expo + TypeScript)
- [x] 1.2 Navegación (5 tabs + Stack modal)
- [x] 1.3 Sistema de Diseño (Colores, spacing, tipografía)
- [x] 1.4 Componentes Base (6 componentes reutilizables)
- [x] 1.5 SQLite Setup (8 tablas, CRUD, índices)
- [x] 1.6 Modelos de Datos (5 modelos + lógica)
- [x] 1.7 Seed Categorías (6 categorías + CRUD)
- [x] 1.8 Tests Unitarios (111 tests, 100% passing)

---

**Siguiente Fase:** Phase 2 - Registros & Cronología CRUD
