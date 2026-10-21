# 📱 CRONIA - Personal Organization & Tracking App

Una aplicación React Native construida con Expo para organizar y hacer seguimiento de tareas, notas, eventos y hábitos. Offline-first con persistencia local usando SQLite.

## 🎯 Características Principales

- **Tasks/Tareas**: Crear, editar y marcar tareas como completadas
- **Notes/Notas**: Capturar notas con clasificaciones (importante, anécdota, recordatorio, reflexión)
- **Events/Eventos**: Gestionar citas y eventos con duración
- **Habits/Hábitos**: Seguimiento diario de hábitos con estadísticas
- **Categories/Categorías**: 6 categorías predeterminadas (Personal, Laboral, Familiar, Hogar, Ocio, Gastos)
- **Offline-First**: Todo funciona sin conexión a internet
- **SQLite Local**: Persistencia segura en el dispositivo

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

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para documentación detallada.

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
import { initDB } from '@/services';

// En App.tsx o componente raíz
await initDB();
```

## 🧪 Testing

111 tests unitarios cubriendo:
- Database operations (30 tests)
- Business models (30 tests)
- Services (8 tests)
- Utilities (28 tests)
- Components (4 tests - pending React Native setup)

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
  "expo": "~58.0.16",
  "expo-router": "~58.0.24",
  "expo-sqlite": "^14.3.0",
  "react": "^19.3.0",
  "react-native": "^0.88.0",
  "typescript": "^6.0.3",
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

### Phase 1 ✅ COMPLETADA
- [x] Setup inicial y navegación
- [x] Sistema de diseño
- [x] Componentes base
- [x] SQLite setup
- [x] Modelos de datos
- [x] Seed de categorías
- [x] Tests unitarios

### Phase 2 (Próxima)
- [ ] Pantalla Home con cronología
- [ ] Pantalla Create con formularios
- [ ] Pantalla Detail para editar
- [ ] Integración completa CRUD
- [ ] Búsqueda y filtros

### Phase 3
- [ ] Estadísticas y análisis
- [ ] Seguimiento de hábitos
- [ ] Configuración y temas
- [ ] Exportación de datos

## 🐛 Troubleshooting

### Error: "Cannot find expo"
```bash
npm install expo --legacy-peer-deps
```

### Error en tests: "Flow is not supported"
Los componentes React Native tienen Flow syntax. Los tests de componentes se ejecutarán cuando se configure React Native Testing Library.

### BD no se inicializa
Verificar que `initDB()` se llama en el arranque:
```typescript
import { initDB } from '@/services';
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

Desarrollado por Agrod

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio.

---

**Última actualización**: 21 de octubre de 2026  
**Status**: Phase 1 Complete ✅ (111 tests passing)  
**Próxima sesión**: Phase 2 - Registros & Cronología CRUD
