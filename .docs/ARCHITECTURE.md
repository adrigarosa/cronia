# CRONIA - Arquitectura

**Última actualización:** 23 de octubre de 2026

Stack: Expo 57, React Native 0.86, expo-router, expo-sqlite y TypeScript. Persistencia local offline-first, sin backend.

---

## 📐 Capas

```
Pantallas (src/app, Expo Router)
        ↓
Componentes (src/components) y tema (src/theme)
        ↓
Hooks (src/hooks)  ·  Dominio puro (src/domain)
        ↓
Modelos (src/models)  ·  Utilidades (src/utils)
        ↓
Servicios (src/services): inicialización de BD y seed
        ↓
Acceso a datos (src/database): CRUD sobre expo-sqlite
        ↓
SQLite local
```

- `src/domain/` contiene lógica pura, sin React ni SQLite: estados efectivos de registros, filtros, periodos y estadísticas. Tiene tests propios.
- `src/utils/` contiene validación de formularios, parsers, exportación, copia de seguridad y notificaciones en la app.

---

## 🗂️ Estructura de `src/`

```
src/
├── app/                      # Rutas (Expo Router)
│   ├── _layout.tsx           # Stack raíz
│   ├── create.tsx            # Crear registro (modal)
│   ├── settings.tsx          # Ajustes
│   ├── (home)/               # Detalle de registro
│   │   ├── _layout.tsx
│   │   └── [id].tsx
│   └── (tabs)/               # Pestañas
│       ├── _layout.tsx
│       ├── index.tsx         # Cronología
│       ├── search.tsx        # Buscar
│       └── stats.tsx         # Seguimiento
├── components/               # Button, Input, Card, Badge, RecordItem,
│                             # Select, TabBar, EmptyState, LoadingSpinner, icons
├── constants/                # colors, spacing, typography, themes
├── theme/                    # tokens.ts, AppearanceContext.tsx
├── domain/                   # records.ts, stats.ts (lógica pura)
├── models/                   # Task, Note, Event, Habit, Category
├── database/                 # schema, types, db, tasks, notes, events,
│                             # habits, categories, recordCategories
├── services/                 # DatabaseService, CategorySeedService
├── hooks/                    # useRecords, useTasks, useNotes, useEvents,
│                             # useHabits, useCategories, useSearch, useStats,
│                             # useSettings, useTheme
└── utils/                    # validators, formParsers, backup, dataExport,
                              # notifications, analytics, clone, id, colors
```

Los archivos `*.test.ts` y `*.sqlite.test.ts` están junto al código que prueban.

---

## 🗄️ Base de datos

Ocho tablas en SQLite: `categories`, `records`, `tasks`, `notes`, `events`, `habits`, `habit_logs` y `record_categories`.

- `records` es la tabla común. `tasks`, `notes`, `events` y `habits` guardan los campos específicos de cada tipo.
- `record_categories` relaciona registros y categorías (muchos a muchos).
- `habit_logs` guarda el cumplimiento diario de cada hábito.
- Las migraciones son idempotentes (comprueban `PRAGMA table_info`). La versión actual es el esquema v2.
- Los borrados son lógicos (soft delete) para conservar el historial.

El esquema exacto está en `src/database/schema.ts`.

### Categorías predeterminadas

Personal, Laboral, Familiar, Hogar, Ocio y Gastos. Se crean con `CategorySeedService`. El usuario puede añadir más, renombrarlas y archivarlas.

---

## 🧠 Reglas de negocio

- **Tareas:** estados pendiente, en progreso y completada. Pueden tener vencimiento.
- **Notas:** clasificación importante, anécdota, recordatorio o reflexión.
- **Eventos:** fecha y hora de inicio y fin, lugar en texto libre. Próximo, en curso, realizado o cancelado.
- **Hábitos:** días previstos. Un día previsto que termina sin registro pasa a «No realizado». Los días no previstos no cuentan. Se calcula al mostrar, en `src/domain/records.ts`.
- **Estadísticas:** cumplimiento = días realizados / días previstos evaluables. Los días abiertos no cuentan como incumplidos.

---

## 🧪 Tests

| Tipo | Herramienta | Resultado |
|---|---|---|
| Lógica, BD y hooks | vitest 5 | 399 pasando (32 archivos) |
| Componentes | jest 29 + jest-expo | 5 pasando |

Las pruebas de SQLite real están en `*.sqlite.test.ts`. Las pruebas de componentes no cubren aún todas las pantallas.

---

## 📊 Decisiones arquitectónicas

1. **Soft delete:** los registros eliminados se marcan, no se borran físicamente.
2. **Tabla común de registros:** un `records` para todos los tipos, con tablas específicas.
3. **Lógica en el dominio:** los cálculos de estado y estadísticas están en funciones puras, probadas sin base de datos.
4. **Offline-first:** no hay llamadas a red para las funciones principales.
5. **Sin mapas ni geolocalización:** el lugar de un evento es texto libre.
