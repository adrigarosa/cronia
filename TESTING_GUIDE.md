# CRONIA - Testing Guide with Expo Go

## Requisitos Previos

1. **Expo Go instalado en tu dispositivo**
   - iOS: App Store - "Expo Go"
   - Android: Google Play Store - "Expo Go"

2. **Conectado a la misma red WiFi** que tu computadora

---

## Opción 1: Desde Terminal (Recomendado)

### Paso 1: Inicia el servidor de desarrollo

```bash
cd cronia
npm start
```

Verás algo como:
```
expo-router/entry ready on port 8081
Tunnel ready on http://tunnel.local/xxxxxx
LAN  ready on 192.168.x.x:8081
```

### Paso 2: Conecta tu dispositivo

**En iOS:**
- Abre Expo Go
- Presiona el botón "+" o "Scan QR code"
- Escanea el código QR que aparece en la terminal

**En Android:**
- Abre Expo Go
- Presiona el botón "+" o "Tap to Connect"
- Escanea el código QR que aparece en la terminal

### Paso 3: ¡La app está corriendo!

---

## Opción 2: Con Tunnel (Si no ves el QR)

Si tienes problemas con el QR, usa Tunnel:

```bash
npm start -- --tunnel
```

Esto te dará un enlace como:
```
exp://u.expo.dev/...
```

Cópialo y pégalo en Expo Go.

---

## Pantallas para Probar

### 1. **Home (Cronología)**
- Ver todas las tareas, notas y eventos
- Filtrados por fecha descendente
- Hacer tap para ver detalles

### 2. **Create (Crear)**
- Selecciona tipo: Tarea, Nota, Evento o Hábito
- Completa el formulario
- Presiona "Guardar"

### 3. **Search (Búsqueda)**
- Busca por texto
- Filtra por estado
- Filtra por categoría
- Filtra por fecha

### 4. **Stats (Estadísticas)**
- Ve el progreso general
- Estadísticas por categoría
- Gráficos de tendencia
- Tareas de alto impacto

### 5. **Settings (Configuración)**
- Cambia tema (Claro/Oscuro/Automático)
- Cambia idioma
- Configura formato de fecha
- Activa/desactiva notificaciones

---

## Funcionalidades que Puedes Probar

✅ **Crear tareas, notas y eventos**
✅ **Buscar y filtrar registros**
✅ **Ver estadísticas detalladas**
✅ **Cambiar tema (claro/oscuro)**
✅ **Cambiar idioma y formatos**
✅ **Crear hábitos y registrar completaciones**
✅ **Soft delete de registros**

---

## Datos de Prueba

La app viene pre-cargada con:
- 6 categorías predeterminadas
- Datos de ejemplo si es primera ejecución

---

## Troubleshooting

### "No veo el QR"
- Asegúrate de estar en la misma red WiFi
- Intenta: `npm start -- --tunnel`
- Reinicia Expo Go

### "Connection refused"
- Verifica que el puerto 8081 no esté en uso
- Intenta: `npm start -- --port 8082`

### "App crashes"
- Ve a la terminal y busca mensajes de error
- Reporta en el archivo PROGRESS.md

### "No puedo crear registros"
- Verifica que hayas ingresado datos válidos
- Abre la consola de JavaScript (Shake on device)

---

## Accesos Rápidos

**Ver logs en tiempo real:**
- En Expo Go, presiona "j" en la terminal
- En el dispositivo: Shake (iOS) o 2-finger tap (Android)

**Recargar la app:**
- Terminal: Presiona "r"
- Dispositivo: Shake y toca "Reload"

**Ver errores detallados:**
- Terminal: Presiona "d" para dev tools
- Espera a que se abra en el navegador

---

## Capacidades de la App en Expo Go

✅ React Native components
✅ Navigation (Expo Router)
✅ SQLite local database
✅ AsyncStorage (settings)
✅ Sensores (si el dispositivo los tiene)
✅ Gestos y animaciones
✅ Iconos (FontAwesome)

❌ **NO funcionarán en Expo Go:**
- Módulos nativos no incluidos
- Características de cámara (sin build personalizado)
- Background tasks (requiere build)
- Notificaciones push (requiere build)

---

## Siguiente Paso: Build Personalizado

Si necesitas características nativas, debes hacer un build:

```bash
npx eas build --platform ios --profile development
# o
npx eas build --platform android --profile development
```

Pero por ahora, **Expo Go te permite probar el 95% de la funcionalidad**.

---

## Notas Importantes

- Todos los datos se guardan localmente en el dispositivo
- No hay sincronización en la nube (Phase 4 feature)
- Los datos persisten aunque cierres la app
- Puedes resetear todo en Settings

---

**¡A disfrutar probando CRONIA!** 🚀
