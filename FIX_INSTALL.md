# Fix para npm install errors

## Problema

Conflicto de peer dependencies entre:
- `react@19.3.0` (proyecto)
- `react-test-renderer@19.3.1` (testing library)

## Solución Rápida

### Opción 1: Usar --legacy-peer-deps (RECOMENDADO)

```bash
npm install --legacy-peer-deps
```

Esto ignora los conflictos de peer deps y instala todo correctamente.

### Opción 2: Limpiar e Reinstalar

```bash
# Eliminar node_modules y package-lock
rm -r node_modules
rm package-lock.json

# Reinstalar
npm install --legacy-peer-deps
```

### Opción 3: Usar Bun (Más rápido)

```bash
# Si tienes bun instalado
bun install
```

---

## Por qué sucede esto

React 19.3.0 cambió sus tipos peer. Las testing libraries todavía esperan 19.3.1.

La solución es usar `--legacy-peer-deps` que ignora estos conflictos menores.

---

## Después de Instalar

Verifica que todo está bien:

```bash
npx expo lint
npx tsc --noEmit
npm test -- --run
```

---

## Para iniciar la app

```bash
npm start
```

Luego escanea el QR en Expo Go.

---

**¡Listo! El error está resuelto.** ✅
