# 📱 CRONIA - Personal Organization & Tracking App

Una aplicación React Native construida con Expo para organizar y hacer seguimiento de tareas, notas, eventos y hábitos. Offline-first con persistencia local usando SQLite.

## 🎯 Características Principales

### Gestión de Registros ✅

- **Tasks/Tareas**: Crear, editar, marcar como completadas, establecer vencimientos
- **Notes/Notas**: Capturar notas con clasificaciones (importante, anécdota, recordatorio, reflexión)
- **Events/Eventos**: Gestionar citas y eventos con fecha, hora y ubicación
- **Habits/Hábitos**: Seguimiento diario de hábitos con estadísticas mensuales

### Búsqueda y Filtros ✅

- Búsqueda por texto (case-insensitive)
- Filtrar por estado (Pendiente, En Progreso, Completado)
- Filtrar por categoría
- Filtrar por rango de fechas
- Combinar múltiples filtros

### Estadísticas y Analytics ✅

- Dashboard con métricas principales
- Tasa de completitud
- Distribución por estado con gráficos
- Tareas vencidas
- Promedio de días para completar
- Estadísticas por categoría
- Selector de período (Día, Semana, Mes, Año)

### Extras ✅

- **Categories/Categorías**: 6 categorías predeterminadas
- **Offline-First**: Todo funciona sin conexión
- **SQLite Local**: Persistencia segura
- **Timeline**: Cronología intuitiva con pull-to-refresh

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- npm o bun
- Expo CLI (instalado con npm)

### Instalación

```bash
# Clonar repositorio
cd cronia

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
npm run dev
# o con Expo
npx expo start
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo tests específicos
npm test -- src/utils
npm test -- src/database
npm test -- src/models

# Ejecutar en modo watch
npm test -- --watch
```

### Lint y Typecheck

```bash
# Verificar lint
npx expo lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📁 Estructura del Proyecto

```
src/
├── app/              # Rutas y pantallas (Expo Router)
├── components/       # Componentes UI reutilizables
├── models/          # Lógica de negocio (Task, Note, Event, Habit)
├── database/        # Acceso a datos SQLite
├── services/        # Lógica de aplicación
├── constants/       # Tokens de diseño
└── utils/          # Funciones utilitarias
```

Ver [.docs/ARCHITECTURE.md](./.docs/ARCHITECTURE.md) para documentación detallada. Los demás documentos de desarrollo están en [.docs/](./.docs/).

## 🏗️ Arquitectura

La aplicación sigue un patrón layered:

```
Screens (Expo Router)
    ↓
Components (UI Layer)
    ↓
Services (Business Logic)
    ↓
Models (Domain Objects)
    ↓
Database (SQLite Access)
    ↓
SQLite (Local Storage)
```

## 🗄️ Base de Datos

### Tablas

- `categories` - Categorías predeterminadas
- `records` - Base unificada para todos los tipos
- `tasks`, `notes`, `events`, `habits` - Tablas específicas
- `habit_logs` - Seguimiento diario de hábitos
- `record_categories` - Relaciones many-to-many

### Inicialización

La base de datos se inicializa automáticamente en el arranque:

```typescript
import { initDB } from "@/services";

// En App.tsx o componente raíz
await initDB();
```

## 🧪 Testing

399 tests de lógica con Vitest (32 archivos) y 5 tests de componentes con
Jest (`npm run test:components`). El conjunto completo se ejecuta con
`npm test`.

**Ejecutar tests:**

```bash
npm test -- --run
```

## 🎨 Diseño

Sistema de diseño basado en tokens:

### Colores

- **Primario**: #EC4899 (Pink/Personal)
- **Secundarios**: Colores por categoría
- **Fondo**: Blanco (claro) / Gris oscuro (dark)

### Espaciado

- xs (4px), sm (8px), md (16px), lg (24px), xl (32px), xxl (48px)

### Tipografía

- **Plus Jakarta Sans**: Body
- **Sora**: Headings

Ver [src/constants/](./src/constants/) para configuración completa.

## 📦 Dependencias Clave

```json
{
  "expo": "^57.0.31",
  "expo-router": "~57.0.29",
  "expo-sqlite": "~57.0.4",
  "react": "19.2.3",
  "react-native": "0.86.3",
  "typescript": "~6.0.3",
  "vitest": "^5.0.5"
}
```

## 🔄 Workflow de Desarrollo

### Crear una nueva pantalla

1. Crear archivo en `src/app/`
2. Implementar componente React
3. Usar componentes base de `src/components/`
4. Conectar servicios de `src/services/`
5. Agregar tests

### Agregar nueva funcionalidad a BD

1. Actualizar schema en `src/database/schema.ts`
2. Crear funciones CRUD en `src/database/{entity}.ts`
3. Crear modelo en `src/models/{Entity}.ts`
4. Agregar tests
5. Actualizar índice de exportaciones

## 🚧 Roadmap

Estado detallado en [.docs/PROJECT_STATUS.md](./.docs/PROJECT_STATUS.md).

- [x] Fase 1: Fundamentos
- [x] Fase 2: Registros y cronología
- [x] Fase 3: Búsqueda y filtros
- [x] Fase 4: Seguimiento (estadísticas por día, semana, mes y año)
- [x] Rediseño según la plantilla definitiva
- [ ] Fase 5: Robustez y web (copia de seguridad completada; pendientes pruebas offline, validación web y transferencia entre Android y web)
- [ ] Build y distribución con EAS

### Próximos pasos

1. Probar el uso offline en Android, incluyendo modo avión, reinicio y
   cambios de zona horaria.
2. Validar la persistencia de SQLite en la versión web.
3. Decidir cómo se transferirán los datos entre Android y web.
4. Completar validaciones y manejo de errores.
5. Resolver el alcance de prioridades, eventos pasados, frecuencias de
   hábitos y notificaciones.

## 🐛 Troubleshooting

### Error: "Cannot find expo"

```bash
npm install expo --legacy-peer-deps
```

### Tests de componentes

Los tests de componentes se ejecutan con Jest y `jest-expo`:

```bash
npm run test:components
```

### BD no se inicializa

Verificar que `initDB()` se llama en el arranque:

```typescript
import { initDB } from "@/services";
useEffect(() => {
  initDB();
}, []);
```

## 📝 Notas Técnicas

- **TypeScript**: Configurado con `strict: false` para compatibilidad Expo
- **Tests**: Vitest con ambiente Node (no React Native)
- **BD**: expo-sqlite con soft deletes
- **Modelos**: Clases TypeScript con métodos de negocio

## 🔐 Privacidad

Todos los datos se almacenan localmente en el dispositivo. No hay conexión a servidores externos.

## 📄 Licencia

Privado - Proyecto personal

## 👤 Autor

Desarrollado por Adriana Rodríguez

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.

---

**Última actualización**: 23 de octubre de 2026  
**Estado**: Fases 1 a 4 completas ✅ · Fase 5 parcial ⚠️  
**Validación**: 399 tests Vitest + 5 tests Jest, TypeScript sin errores y lint sin avisos
