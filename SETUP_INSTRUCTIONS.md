# CRONIA - Setup Instructions

## Para Probar con Expo Go

### Paso 1: Instalar dependencias

```bash
cd C:\Users\agrod\developer\proyecto\cronia
npm install
```

**Si npm tarda o da error, espera a que termine. El .npmrc ya tiene configurado legacy-peer-deps.**

### Paso 2: Iniciar el servidor

```bash
npm start
```

Espera hasta ver:

```
LAN:  http://192.168.x.x:8081
Tunnel: exp://u.expo.dev/...

Scan this QR code with Expo Go:
```

### Paso 3: Escanea QR en Expo Go

**iPhone:**
1. Abre Expo Go
2. Presiona "+" en la esquina superior derecha
3. Presiona "Scan QR Code"
4. Apunta la cámara al QR

**Android:**
1. Abre Expo Go
2. Presiona el botón azul "+"
3. Presiona "Scan QR Code"
4. Apunta la cámara al QR

### Paso 4: ¡La app se carga!

Dentro de 10-30 segundos verás CRONIA en tu dispositivo.

---

## Si npm install se queda colgado

Abre otra terminal y ejecuta:

```bash
npm install --force
```

O simplemente espera a que termine (puede tardar 5-10 minutos la primera vez).

---

## Si ves "Incompatible SDK version"

**Solución:**
1. Cierra Expo Go completamente
2. Vuelve a abrir Expo Go
3. Escanea el QR nuevamente

Si persiste:
1. Cierra npm (Ctrl+C en terminal)
2. Ejecuta: `npm start`
3. Vuelve a escanear

---

## Si ves "Project is incompatible with this version of Expo Go"

**Solución:**
1. Asegúrate de tener la versión más reciente de Expo Go
2. Ve a App Store / Play Store y actualiza Expo Go
3. Vuelve a escanear el QR

---

## Comandos Útiles

```bash
# Ver logs en tiempo real
npm start

# Recargar la app (en la terminal)
Presiona 'r'

# Ver developer tools
Presiona 'd' en la terminal

# Limpiar caché
npm start -- --clear

# Cambiar puerto (si 8081 está en uso)
npm start -- --port 8082

# Usar Tunnel en lugar de LAN
npm start -- --tunnel
```

---

## Verificar que todo está bien

```bash
# TypeScript check
npx tsc --noEmit

# Lint
npx expo lint

# Tests
npm test -- --run

# Build test
npx expo lint
```

---

## Si aún tienes problemas

1. **Cierra todo:**
   - Cierra Expo Go
   - Cierra la terminal (Ctrl+C)
   - Cierra VS Code

2. **Limpia el caché:**
   ```bash
   cd C:\Users\agrod\developer\proyecto\cronia
   npm start -- --clear
   ```

3. **Vuelve a intentar:**
   - Escanea el QR nuevamente

---

## Estructura de la App

```
HOME
  ├─ Ver todos los registros (tareas, notas, eventos)
  └─ Tap para ver detalles

CREATE
  ├─ Crear Tarea
  ├─ Crear Nota
  ├─ Crear Evento
  └─ Crear Hábito

SEARCH
  ├─ Buscar por texto
  ├─ Filtrar por estado
  ├─ Filtrar por categoría
  └─ Filtrar por fecha

STATS
  ├─ Estadísticas generales
  ├─ Breakdown por categoría
  ├─ Gráficos de tendencia
  └─ Tareas críticas

SETTINGS
  ├─ Tema (Claro/Oscuro/Automático)
  ├─ Idioma (Español/English)
  ├─ Formato de fecha
  ├─ Formato de hora
  └─ Notificaciones
```

---

## Datos Pre-cargados

6 categorías con colores:
- Personal (Rosa)
- Work (Azul)
- Family (Cyan)
- Home (Naranja)
- Leisure (Púrpura)
- Expenses (Verde)

---

## Próximos Pasos

Después de probar en Expo Go y estar feliz con la app, puedes:

1. **Hacer un Build personalizado:**
   ```bash
   npx eas build --platform ios --profile development
   ```

2. **Distribuir a la App Store/Play Store:**
   ```bash
   npx eas submit
   ```

3. **Agregar Sincronización en la Nube** (Phase 4)

---

## Requisitos Mínimos

- **Dispositivo:** iOS 13+ o Android 6+
- **Expo Go:** Última versión
- **WiFi:** Misma red que tu computadora
- **Node.js:** v18+
- **npm:** v9+

---

**¡Todo listo! A disfrutar de CRONIA!** 🚀
