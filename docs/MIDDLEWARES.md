# Middlewares de Protección de Rutas - SPP Frontend

Esta documentación explica cómo funcionan los middlewares de protección y cómo usarlos en tus páginas.

---

## 📋 Tabla de Contenidos

1. [Middlewares Disponibles](#middlewares-disponibles)
2. [Cómo Usar Middlewares](#cómo-usar-middlewares)
3. [Creando un Nuevo Middleware](#creando-un-nuevo-middleware)
4. [Flujo de Autenticación](#flujo-de-autenticación)

---

## Middlewares Disponibles

### `auth.global.ts` - Autenticación Global

**Ubicación:** `app/middleware/auth.global.ts`

**Comportamiento:**
- Se ejecuta en **todas las rutas** automáticamente (es `.global`)
- Verifica si el usuario tiene una sesión válida
- Si no hay sesión, redirige a `/login` con query `?redirect=<ruta_original>`
- Ignora la página `/login` para evitar bucles infinitos

**No necesitas hacer nada** para que funcione, se aplica a todas las rutas excepto `/login`.

---

### `admin.ts` - Solo Administradores

**Ubicación:** `app/middleware/admin.ts`

**Comportamiento:**
- Verifica que el usuario tenga rol `admin`
- Si no es admin, redirige a `/` con mensaje de error

**Cuándo usarlo:**
- Páginas de configuración de sistema
- Gestión de roles
- Funcionalidades exclusivas de administrador

**Ejemplo:**
```vue
<script setup>
definePageMeta({
  middleware: 'admin'
})
</script>
```

---

### `user-management.ts` - Gestión de Usuarios

**Ubicación:** `app/middleware/user-management.ts`

**Comportamiento:**
- Verifica permiso `user:list`
- Permite acceso a `admin` y `moderator`
- Redirige a `/` si no tiene permisos

**Cuándo usarlo:**
- Páginas donde se listan usuarios
- Funcionalidades de moderación

**Ejemplo:**
```vue
<script setup>
definePageMeta({
  middleware: 'user-management'
})
</script>
```

---

## Cómo Usar Middlewares

### En una página Vue

```vue
<script setup>
// Middleware único
definePageMeta({
  middleware: 'admin'
})

// O múltiples middlewares (se ejecutan en orden)
definePageMeta({
  middleware: ['admin', 'otro-middleware']
})
</script>
```

### Orden de ejecución

1. **`auth.global.ts`** - Siempre primero (verifica sesión)
2. Middlewares definidos en `definePageMeta` en orden

Por ejemplo, con `middleware: ['admin']`:
1. Se verifica sesión (global)
2. Se verifica rol admin

---

## Creando un Nuevo Middleware

### Template para middleware de permiso

```typescript
// app/middleware/my-feature.ts

/**
 * Middleware de protección para [descripción]
 *
 * Permisos requeridos: [recurso]:[acción]
 * Roles permitidos: [lista de roles]
 *
 * @example
 * definePageMeta({
 *   middleware: 'my-feature'
 * })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { checkPermission, isAdmin } = useRole()

  // Admins siempre tienen acceso (opcional)
  if (isAdmin.value) {
    return
  }

  // Verificar permiso específico
  const hasPermission = checkPermission({ myResource: ['view'] })

  if (!hasPermission) {
    return navigateTo({
      path: '/',
      query: { 
        error: 'unauthorized', 
        message: 'Acceso denegado: Se requiere permiso [descripción]' 
      }
    })
  }
})
```

### Template para middleware de rol estricto

```typescript
// app/middleware/super-admin.ts

export default defineNuxtRouteMiddleware(async () => {
  const { hasRole } = useRole()

  // Solo un rol específico
  if (!hasRole('admin')) {
    return navigateTo({
      path: '/',
      query: { error: 'unauthorized' }
    })
  }
})
```

---

## Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario accede a /settings/users          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. auth.global.ts                                          │
│  ¿Tiene sesión válida?                                      │
│  SÍ → continuar │ NO → redirect /login?redirect=/settings/users│
└─────────────────────────────────────────────────────────────┘
                              │ SÍ
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. user-management.ts (definido en la página)              │
│  ¿Es admin?                                                 │
│  SÍ → acceso │ NO → ¿Tiene permiso user:list?               │
│               │      SÍ → acceso │ NO → redirect /          │
└─────────────────────────────────────────────────────────────┘
                              │ ACCESO
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Página se renderiza                                     │
│  - useUsersList() obtiene datos                             │
│  - UI muestra/oculta botones según permisos                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Tabla de Roles y Middlewares

| Middleware | admin | moderator | user |
|------------|-------|-----------|------|
| `auth.global` | ✅ | ✅ | ✅ |
| `admin` | ✅ | ❌ | ❌ |
| `user-management` | ✅ | ✅ | ❌ |

---

## Buenas Prácticas

### 1. Doble protección

Siempre protege tanto la **ruta** (con middleware) como la **UI** (con `v-if`):

```vue
<script setup>
// Protección de ruta
definePageMeta({
  middleware: 'admin'
})

// Protección de UI (redundante pero segura)
const { isAdmin } = useRole()
</script>

<template>
  <button v-if="isAdmin" @click="deleteAll">
    Eliminar todo
  </button>
</template>
```

### 2. Mensajes de error claros

Incluye mensajes descriptivos en los redirects:

```typescript
return navigateTo({
  path: '/',
  query: { 
    error: 'unauthorized', 
    message: 'Se requiere permiso de administrador' 
  }
})
```

### 3. Evita lógica compleja en middlewares

Los middlewares deben ser simples verificaciones. La lógica compleja va en composables:

```typescript
// ❌ Malo
export default defineNuxtRouteMiddleware(async () => {
  const response = await $fetch('/api/complex-check')
  if (response.someCondition && response.otherCondition) {
    // ...
  }
})

// ✅ Bueno
export default defineNuxtRouteMiddleware(async () => {
  const { checkPermission } = useRole()
  if (!checkPermission({ feature: ['access'] })) {
    return navigateTo('/')
  }
})
```
