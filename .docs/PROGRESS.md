# CRONIA - Registro de progreso

**Proyecto:** aplicación personal de organización y seguimiento
**Inicio:** 21 de octubre de 2026
**Última actualización:** 23 de octubre de 2026

Este documento sigue la numeración de fases de [especificacion_app_personal.md](./especificacion_app_personal.md) (sección 12). El estado resumido está en [PROJECT_STATUS.md](./PROJECT_STATUS.md).

---

## Resumen por fase

| Fase | Descripción | Estado | Commits clave |
|---|---|---|---|
| 1 | Fundamentos | ✅ Completa | `c114e4d`, `62d76ff`, `faa74a3`, `39ea2b1` |
| 2 | Registros y cronología | ✅ Completa | `55be23f`, `17b85d4`, `c92ae29`, `98f74b2` |
| 3 | Búsqueda y filtros | ✅ Completa | `634a4cc`, `596f8d0` |
| 4 | Seguimiento | ✅ Completa | `c884e71`, `9171c99` |
| 5 | Robustez y web | ⚠️ Parcial | `dbbf14f` (copia de seguridad) |

Además, se hizo un rediseño de la interfaz según la plantilla definitiva (commits `b0403e5` a `dbbf14f`). Ese trabajo se detalla en la sección de rediseño.

---

## Fase 1: Fundamentos ✅

- Proyecto Expo con TypeScript, navegación con Expo Router y sistema de diseño (paleta, espaciado y tipografía).
- Componentes base: Button, Input, Card, Badge, LoadingSpinner, EmptyState.
- SQLite local con tablas `categories`, `records`, `tasks`, `notes`, `events`, `habits`, `habit_logs` y `record_categories`.
- Modelos de negocio: Task, Note, Event, Habit y Category.
- Seed de 6 categorías predeterminadas: Personal, Laboral, Familiar, Hogar, Ocio y Gastos.

## Fase 2: Registros y cronología ✅

- Hooks `useTasks`, `useNotes` y `useCategories`, con CRUD de notas, eventos y hábitos.
- Pantalla de cronología, formularios de creación para los cuatro tipos, detalle y edición.
- Hábitos: definición, registro diario de cumplimiento y estadísticas mensuales.

## Fase 3: Búsqueda y filtros ✅

- Búsqueda por descripción o contenido, con debounce.
- Filtros por tipo, estado, categoría y rango de fechas, combinables.
- Filtros de hábitos (cumplidos, no cumplidos, intervalo de fechas).

## Fase 4: Seguimiento ✅

- `src/domain/stats.ts`: rangos de periodo, mezcla por tipo, series y calendario mensual.
- Pantalla con selector Día, Semana, Mes y Año, indicadores de tareas, citas y hábitos, anillo de hábitos, rejilla de 7 días y barras por categoría.

## Fase 5: Robustez y web ⚠️ (parcial)

Hecho:
- Copia de seguridad: exportar JSON y restaurar con confirmación (`src/utils/backup.ts`, `src/utils/dataExport.ts`).

Pendiente:
- Pruebas de uso offline en Android.
- Validación de SQLite en navegador.
- Definir la transferencia de datos entre Android y web.
- Manejo de errores y validaciones adicionales.

---

## Rediseño según plantilla ✅

Fuente de verdad: `.docs/CRONIA - diseño definitivo.html` (capturas en `.docs/CRONIA-png/`). Las páginas «Propuesta B · Aurora» del HTML son una alternativa, no el diseño definitivo.

| Subfase | Descripción | Commit |
|---|---|---|
| Tokens e iconos | Paleta, tipografías Sora y Plus Jakarta Sans, iconos SVG y 3 temas de color | `b0403e5` |
| Esquema v2 | Categorías archivables, días de hábito y asignación por registro | `d169fdf` |
| Dominio de registros | Modelo unificado, estados efectivos y filtros | `85dc1f3` |
| Esqueleto y cronología | 3 pestañas (Cronología, Buscar, Seguimiento), FAB y Ajustes en stack | `1182686` |
| Crear | Selector de 4 tipos, campos según tipo y días de hábito | `d77d4c0` |
| Buscar | Búsqueda con debounce y filtros con modal de selección | `596f8d0` |
| Seguimiento | Vistas por periodo, anillo de hábitos y calendario | `9171c99` |
| Ajustes | Categorías, apariencia y copia de seguridad | `dbbf14f` |

Ver `src/theme/tokens.ts` y `src/components/icons.tsx`.

---

## Métricas (23/10/2026)

- Tests vitest: 399 pasando (32 archivos).
- Tests jest (componentes): 5 pasando.
- `npx tsc --noEmit`: sin errores.
- `npx expo lint`: 0 errores, 25 avisos.

---

## Decisiones pendientes

Ver sección 13 de la especificación: uso de la web, orden de la cronología, prioridad de tareas, eventos pasados sin resultado, frecuencias y corrección de hábitos, formato de copia de seguridad y notificaciones.
