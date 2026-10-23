# CRONIA - Estado del proyecto

**Última actualización:** 23 de octubre de 2026
**Estado general:** 🟢 Activo. Fases 1 a 4 completadas; fase 5 parcial.

Fuente de requisitos: [especificacion_app_personal.md](./especificacion_app_personal.md) (sección 12, fases de implementación).
Historial detallado por commit: [PROGRESS.md](./PROGRESS.md).

---

## 📋 Resumen

| Fase (especificación) | Estado | Notas |
|---|---|---|
| 1. Fundamentos | ✅ Completa | Expo, navegación, SQLite, modelo de datos, 6 categorías predeterminadas. |
| 2. Registros y cronología | ✅ Completa | Crear, editar y consultar tareas, notas, eventos y hábitos. Cronología unificada. |
| 3. Búsqueda y filtros | ✅ Completa | Búsqueda por texto y filtros por tipo, estado, categoría y fecha. Filtros de hábitos. |
| 4. Seguimiento | ✅ Completa | Vistas Día, Semana, Mes y Año. Indicadores de tareas, citas, hábitos y categorías. |
| 5. Robustez y web | ⚠️ Parcial | Copia de seguridad hecha. Pendiente: pruebas offline, validación web, transferencia Android-web. |

---

## ✅ Hecho

- **Registros:** tareas (con vencimiento y estados), notas (con clasificación), eventos (fecha, hora, lugar en texto) y hábitos (días previstos y registro diario).
- **Cronología:** lista agrupada por día con chips por tipo.
- **Búsqueda:** texto con debounce y filtros combinables (tipo, estado, categoría, fechas).
- **Seguimiento:** total y mezcla por tipo, actividad, tareas y citas, anillo de hábitos, rejilla de 7 días, calendario mensual y barras por categoría.
- **Ajustes:** gestión de categorías (alta, renombrado, archivar), apariencia (claro, oscuro, sistema y 3 temas de color) y copia de seguridad (exportar e importar JSON).
- **Hábitos:** un día previsto sin registro se muestra como «No realizado»; los días no previstos no cuentan. Se calcula en el dominio, no con una tarea programada.
- **Diseño:** pantallas según la plantilla «CRONIA - diseño definitivo» (`.docs/CRONIA - diseño definitivo.html`).

## ⏳ Pendiente

### Fase 5: Robustez y web
- [ ] Pruebas de uso offline (modo avión, reinicio del dispositivo).
- [ ] Validación del almacenamiento en web (SQLite en navegador).
- [ ] Definir si Android y web comparten datos (exportación o importación, u otro mecanismo).
- [ ] Manejo de errores y validaciones adicionales.

### Pendientes de decisión (especificación, sección 13)
- [ ] Prioridad de tareas y reglas de vencimiento.
- [ ] Tratamiento de eventos pasados sin resultado.
- [ ] Frecuencias de hábitos, pausas y corrección de cumplimientos atrasados.
- [ ] Notificaciones locales. El módulo `src/utils/notifications.ts` gestiona notificaciones en la app, pero no hay recordatorios programados en el dispositivo. Está fuera del mínimo acordado.
- [ ] Reconciliación persistente de hábitos al abrir la app. Hoy se calcula al mostrar los datos.

---

## 📊 Métricas (verificadas 23/10/2026)

| Comprobación | Resultado |
|---|---|
| Tests vitest | 399 pasando (32 archivos) |
| Tests jest (componentes) | 5 pasando |
| `npx tsc --noEmit` | Sin errores |
| `npx expo lint` | 0 errores, 25 avisos (de archivos antiguos pendientes de retirar) |

---

## 🔧 Stack (según `package.json`)

- **Expo:** 57 (`expo ^57.0.31`, `expo-router ~57.0.29`, `expo-sqlite ~57.0.4`)
- **React:** 19.2.3 · **React Native:** 0.86.3 · **TypeScript:** ~6.0.3
- **Tests:** vitest 5 (lógica) y jest 29 + jest-expo 57 (componentes)
- **Persistencia:** SQLite local, offline-first, sin backend

---

## 🗂️ Documentación

Todos los documentos de desarrollo están en `.docs/`. `README.md` y `AGENTS.md` quedan en la raíz.

- `PROJECT_STATUS.md`: este documento (estado actual).
- `PROGRESS.md`: registro de progreso por fase y commits.
- `ARCHITECTURE.md`: arquitectura, modelo de datos y estructura de carpetas.
- `especificacion_app_personal.md`: especificación funcional y técnica.
- `SESSION_SUMMARY.md`, `SESSION_2_SUMMARY.md`: resúmenes históricos de sesiones de trabajo. No se actualizan.
- `CRONIA - diseño definitivo.html` y `CRONIA-png/`: plantilla de diseño. Están ignorados por git.

---

## 🚀 Próximos pasos

1. Pruebas de uso offline en Android (modo avión, reinicio, zona horaria).
2. Decidir el alcance web y validar SQLite en navegador.
3. Cerrar las decisiones pendientes de la sección 13 de la especificación.
4. Retirar los archivos antiguos con avisos de lint.
5. Build y distribución con EAS (`eas build`, `eas update`).
