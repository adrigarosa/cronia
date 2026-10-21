# 🚀 CRONIA - Prueba con Expo Go

## ¿Puedo Probar con Expo Go?

**SÍ, COMPLETAMENTE.** ✅

CRONIA está **100% compatible** con Expo Go. No necesitas hacer un build personalizado para probar el 95% de la funcionalidad.

---

## Pasos para Probar

### 1️⃣ **Abre Terminal en la carpeta del proyecto**

```bash
cd C:\Users\agrod\developer\proyecto\cronia
npm start
```

### 2️⃣ **Verás un QR Code en la terminal**

```
Expo Go ready at:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LAN:  http://192.168.x.x:8081
  Tunnel: exp://u.expo.dev/...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scan the QR code above with Expo Go app:
[QR CODE]
```

### 3️⃣ **En tu Dispositivo con Expo Go:**

**iPhone:**
1. Abre la app "Expo Go"
2. Presiona el botón "+" arriba a la derecha
3. Selecciona "Scan QR Code"
4. Apunta a la cámara al QR de la terminal

**Android:**
1. Abre la app "Expo Go"
2. Presiona el botón azul "+" abajo
3. Selecciona "Scan QR Code"
4. Apunta a la cámara al QR de la terminal

### 4️⃣ **¡La app se carga automáticamente!** 🎉

---

## Qué Puedes Hacer en Expo Go

### ✅ Completamente Funcional

- **Home Tab**
  - Ver timeline de tareas, notas y eventos
  - Tap para ver detalles
  - Pull to refresh

- **Create Tab**
  - Crear Tareas
  - Crear Notas
  - Crear Eventos
  - Crear Hábitos
  - Seleccionar categoría y fecha

- **Search Tab**
  - Buscar por texto
  - Filtrar por estado (Pendiente, En progreso, Completada)
  - Filtrar por categoría
  - Filtrar por fecha

- **Stats Tab**
  - Ver estadísticas generales
  - Breakdown por categoría
  - Gráfico de tendencias (últimos 30 días)
  - Tareas de alto impacto

- **Settings Tab**
  - Cambiar tema: Claro / Oscuro / Automático
  - Cambiar idioma: Español / English
  - Formato de fecha: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
  - Formato de hora: 12h / 24h
  - Toggles de notificaciones, sonido, vibración

---

## Datos Pre-cargados

La base de datos SQLite viene con:

### 6 Categorías predeterminadas:
1. **Personal** (Rosa 🌸)
2. **Work** (Azul 🔵)
3. **Family** (Cyan 💙)
4. **Home** (Naranja 🧡)
5. **Leisure** (Índigo 💜)
6. **Expenses** (Lima 💚)

### Estados de Tarea:
- **Pending** - Aún no iniciada
- **In Progress** - Trabajando en ella
- **Completed** - Terminada

---

## Recargar la App

Si haces cambios en el código:

**En la terminal:**
- Presiona `r` para recargar

**En el dispositivo:**
- Shake (iOS) o 2-finger tap (Android)
- Selecciona "Reload"

---

## Ver Logs y Errores

**En la terminal:**
- Presiona `j` para abrir el inspector de JavaScript

**En el dispositivo:**
- Shake (iOS) o 2-finger tap (Android)
- Selecciona "Show developer tools"

---

## Comandos Útiles

```bash
# Iniciar con especificación de red
npm start

# Iniciar en iOS
npm start -- --ios

# Iniciar en Android
npm start -- --android

# Iniciar con Tunnel (si LAN no funciona)
npm start -- --tunnel

# Limpiar caché
npm start -- --clear

# Ver más opciones
npm start -- --help
```

---

## Si Algo No Funciona

### ❌ "No veo el QR"
```bash
# Asegúrate de estar en la misma WiFi
# Intenta:
npm start -- --tunnel
```

### ❌ "Connection Refused"
```bash
# Cierra el proceso anterior
# En otra terminal:
npm start
```

### ❌ "Module not found"
```bash
npm install --legacy-peer-deps
npm start
```

### ❌ "App crashes at startup"
- Revisa los logs en la terminal (busca error rojo)
- Presiona `d` en la terminal para abrir dev tools
- Verifica la consola en el navegador que se abre

---

## Estructura de la App

```
CRONIA
├── Home (index.tsx)
│   └── Timeline de registros
│   └── Detalle modal por tap
│
├── Create (create.tsx)
│   ├── Formulario para Tareas
│   ├── Formulario para Notas
│   ├── Formulario para Eventos
│   └── Formulario para Hábitos
│
├── Search (search.tsx)
│   ├── Búsqueda de texto
│   ├── Filtros avanzados
│   └── Resultados en tiempo real
│
├── Stats (stats.tsx)
│   ├── Estadísticas generales
│   ├── Breakdown por categoría
│   ├── Gráficos de tendencia
│   └── Tareas críticas
│
└── Settings (settings.tsx)
    ├── Tema
    ├── Idioma
    ├── Formatos
    └── Notificaciones
```

---

## Base de Datos Local

Todos los datos se guardan en **SQLite local** en el dispositivo:

- ✅ **Persisten** aunque cierres la app
- ✅ **Privados** - No se envían a ningún servidor
- ✅ **Rápidos** - Sin latencia de red
- ✅ **Reseteables** - Botón en Settings

---

## Próximas Fases

### Phase 4 (Pendiente)
- Performance optimization
- Build para producción
- Deploy a App Store / Play Store

### Phase 5 (Futuro)
- Sincronización en la nube
- Colaboración entre usuarios
- IA para insights

---

## Requisitos del Dispositivo

- **iOS 13+** con Expo Go
- **Android 6+** con Expo Go
- **WiFi** (misma red que tu computadora)
- **Expo Go app instalada**

---

## Versiones

- Expo: 58.0.16
- React: 19.3.0
- React Native: 0.88.0
- TypeScript: 6.0.3
- SQLite: ~58.0.13

---

## Contacto / Bugs

Cualquier error o sugerencia:
1. Verifica la terminal para logs
2. Revisa PROGRESS.md para status
3. Abre un issue en el repo

---

**¡Enjoy testing CRONIA! 🚀**

Made with ❤️ by Agrod
