# Lecciones Aprendidas

Documento de lecciones aprendidas durante el desarrollo del proyecto.

---

## 1. Estructura del Proyecto

### Composables Disponibles

Antes de crear nuevos composables, revisar los existentes:

| Composable | Ubicación | Propósito |
|------------|-----------|-----------|
| `useAuth()` | `app/composables/useAuth.ts` | Autenticación con Better Auth |
| `useAuthSSR()` | `app/composables/useAuth.ts` | Auth para SSR (server-side) |
| `useAuthFetch()` | `app/composables/useAuthFetch.ts` | Wrapper de useFetch para cookies HTTP-only |
| `useRole()` | `app/composables/useRole.ts` | Permisos y roles |

### Middlewares Disponibles

| Middleware | Archivo | Descripción | Uso |
|------------|---------|-------------|-----|
| `auth.global` | `app/middleware/auth.global.ts` | Protección automática de rutas | Se aplica **automáticamente** a todas las páginas |
| `admin` | `app/middleware/admin.ts` | Requiere rol admin | `definePageMeta({ middleware: ['admin'] })` |

### Cómo Verificar

```bash
# Listar middlewares
ls -la app/middleware/

# Listar composables
ls -la app/composables/
```

---

## 2. Configuración de Proxy

Los endpoints del backend deben estar configurados en `nuxt.config.ts`:

```typescript
routeRules: {
  '/api/auth/**': {
    proxy: 'http://localhost:3001/api/auth/**'
  },
  '/api/users/**': {
    proxy: 'http://localhost:3001/api/users/**'
  }
}
```

### Verificar Endpoints del Backend

```bash
# Obtener lista de paths desde OpenAPI spec
curl -s http://localhost:3001/api-json | jq '.paths | keys'
```

---

## 3. Nuxt UI v4 - Tablas

### Columnas Requieren ID

```typescript
const columns = [
  {
    id: 'name',        // ← REQUERIDO
    key: 'name',
    label: 'Nombre'
  }
]
```

### Slots Correctos

```vue
<!-- Correcto -->
<template #status-data="{ row }">
  <UBadge>{{ row.status }}</UBadge>
</template>

<!-- Incorrecto -->
<template #status="{ row }">...</template>
```

---

## 4. Checklist para Nuevas Implementaciones

### Backend
- [ ] Backend corriendo en `:3001`
- [ ] OpenAPI spec accesible en `/api-json`
- [ ] Endpoints documentados

### Frontend
- [ ] Revisar composables existentes en `app/composables/`
- [ ] Verificar middlewares disponibles en `app/middleware/`
- [ ] Confirmar proxies en `nuxt.config.ts`

### Testing
- [ ] Probar en navegador con DevTools Network
- [ ] Verificar que cookies se envían
- [ ] Confirmar tipos en VS Code
- [ ] Probar SSR (hard refresh)

---

## 5. Diferencias Clave: Enfoques de API

| Característica | Better Auth | APIs REST |
|----------------|-------------|-----------|
| **Propósito** | Autenticación | APIs REST tipo-safe |
| **Cliente** | `authClient` | `useApi`, `nuxtApp.$api` |
| **Endpoints** | `/api/auth/**` | `/api/users/**`, etc. |

### Cuándo Usar Cada Uno

**Usar Better Auth cuando:**
- Login/logout
- Registro de usuarios
- Reset de contraseña
- Verificar sesión

**Usar APIs REST cuando:**
- CRUD de recursos
- Listados paginados
- Cualquier endpoint no relacionado con auth

---

**Próxima Revisión:** Actualizar este documento cuando se agreguen nuevos patrones o integraciones.
