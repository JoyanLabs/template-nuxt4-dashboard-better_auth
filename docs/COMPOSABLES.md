# Guía de Composables - SPP Frontend

Esta documentación explica cómo y cuándo usar los composables del proyecto, especialmente en relación con SSR, autenticación y permisos.

---

## 📋 Tabla de Contenidos

1. [Composables de Autenticación](#composables-de-autenticación)
2. [Composables de Roles y Permisos](#composables-de-roles-y-permisos)
3. [Composables de API/Datos](#composables-de-apidatos)
4. [Composables de UI](#composables-de-ui)
5. [Patrones y Buenas Prácticas](#patrones-y-buenas-prácticas)
6. [Creando un Nuevo Composable](#creando-un-nuevo-composable)

---

## Composables de Autenticación

### `useAuthSSR()` - Para Datos en SSR

**Ubicación:** `app/composables/useAuth.ts`

**¿Cuándo usarlo?**
- Cuando necesitas los datos del usuario **desde el primer render del servidor**
- En layouts, páginas principales, o componentes críticos para la primera vista
- Cuando quieres evitar "parpadeos" de contenido (el usuario ve su nombre desde el inicio)

**Características:**
- ✅ Funciona en SSR (Server-Side Rendering)
- ✅ Reenvía cookies correctamente al backend
- ⚠️ Requiere `await` (es asíncrono)
- ❌ No proporciona funciones de acción (signIn, signOut)

**Ejemplo:**
```typescript
// En un componente o página
const { user } = await useAuthSSR()

// El usuario está disponible desde el servidor
console.log(user.value?.name) // "Juan García"
```

**Usado en:**
- `app/components/UserMenu.vue` - Para mostrar nombre/avatar
- `app/middleware/auth.global.ts` - Para verificar sesión

---

### `useAuth()` - Para Acciones en Cliente

**Ubicación:** `app/composables/useAuth.ts`

**¿Cuándo usarlo?**
- Cuando necesitas **ejecutar acciones** (login, logout, registro)
- En componentes secundarios que no afectan al SEO
- Cuando ya estás seguro de que el usuario está en el navegador

**Características:**
- ✅ Proporciona funciones: `signIn()`, `signUp()`, `signOut()`
- ✅ Reactivo y rápido en cliente
- ❌ **NO funciona correctamente en SSR** (puede devolver `null`)
- ⚠️ No requiere `await` para inicializarse

**Ejemplo:**
```typescript
const { user, signIn, signOut, isAuthenticated } = useAuth()

// Para acciones
async function handleLogin() {
  const result = await signIn(email, password)
  if (result.success) {
    await navigateTo('/')
  }
}

// Para UI reactiva (en cliente)
const userName = computed(() => user.value?.name || 'Invitado')
```

**Usado en:**
- `app/components/UserMenu.vue` - Para función `signOut()`
- `app/pages/login.vue` - Para función `signIn()`
- `app/composables/useRole.ts` - Para acceder al usuario

---

### `useAuthFetch()` - Wrapper para SSR

**Ubicación:** `app/composables/useAuthFetch.ts`

**¿Cuándo usarlo?**
- Internamente por `useAuthSSR()` y middlewares
- Cuando necesitas hacer fetch con cookies en SSR

**Problema que resuelve:**
Better Auth usa URLs absolutas, pero en SSR las cookies HTTP-only no se reenvían con URLs absolutas. Este wrapper convierte las URLs a relativas.

**No lo uses directamente** a menos que estés extendiendo la funcionalidad de auth.

---

## Composables de Roles y Permisos

### `useRole()` - Verificación de Permisos

**Ubicación:** `app/composables/useRole.ts`

**¿Cuándo usarlo?**
- Para mostrar/ocultar elementos de UI basándote en permisos
- Para verificar roles antes de ejecutar acciones
- En middlewares de protección de rutas

**Características:**
- Usa `useAuth()` internamente (funciona mejor en cliente)
- Proporciona verificación síncrona y asíncrona

**Métodos disponibles:**

| Método | Tipo | Uso |
|--------|------|-----|
| `hasRole('admin')` | Síncrono | Verificar rol específico |
| `hasRole(['admin', 'moderator'])` | Síncrono | Verificar múltiples roles |
| `checkPermission({ user: ['ban'] })` | Síncrono | Verificar permiso granular (UI) |
| `hasPermission({ user: ['delete'] })` | Asíncrono | Verificar en servidor (crítico) |

**Computed disponibles:**

| Computed | Descripción |
|----------|-------------|
| `isAdmin` | `true` si el usuario es admin |
| `isModerator` | `true` si el usuario es moderator |
| `isUser` | `true` si el usuario es user regular |
| `currentRole` | Devuelve `'admin'`, `'moderator'` o `'user'` |
| `isBanned` | `true` si el usuario está baneado |

**Ejemplo en template:**
```vue
<template>
  <!-- Mostrar botón solo si puede banear -->
  <UButton v-if="checkPermission({ user: ['ban'] })" @click="banUser">
    Banear
  </UButton>
  
  <!-- Mostrar solo para admins -->
  <AdminPanel v-if="isAdmin" />
</template>

<script setup>
const { isAdmin, checkPermission } = useRole()
</script>
```

**Ejemplo en lógica:**
```typescript
const { hasPermission, isAdmin } = useRole()

async function deleteUser(userId: string) {
  // Verificación asíncrona para operaciones críticas
  if (!await hasPermission({ user: ['delete'] })) {
    throw new Error('No autorizado')
  }
  
  await $fetch(`/api/users/${userId}`, { method: 'DELETE' })
}
```

---

## Composables de API/Datos

### `useUsersList()` - Lectura con Caché

**Ubicación:** `app/composables/useUsersAPI.ts`

**Patrón:** Lectura reactiva + caché automática

**Características:**
- Usa `useFetch` de Nuxt con caché
- Verifica permisos antes de hacer fetch
- Se refresca automáticamente al cambiar de usuario

**Ejemplo:**
```typescript
const { data, status, error, refresh } = useUsersList()

// data.value?.users contiene la lista
// status: 'pending' | 'success' | 'error'
```

---

### `useUsersMutations()` - Mutaciones sin Caché

**Ubicación:** `app/composables/useUsersAPI.ts`

**Patrón:** Acciones que modifican datos + invalidación de caché

**Características:**
- Usa `$fetch` directamente (sin caché)
- Verifica permisos antes de cada acción
- Invalida la caché de `useUsersList()` después de mutar

**Métodos disponibles:**

| Método | Permiso Requerido |
|--------|-------------------|
| `createUser(data)` | `isAdmin` |
| `updateUserRole(userId, { role })` | `isAdmin` |
| `banUser(userId, { reason })` | `user:ban` |
| `unbanUser(userId)` | `user:ban` |
| `deleteUser(userId)` | `isAdmin` |

**Ejemplo:**
```typescript
const { banUser, deleteUser } = useUsersMutations()

async function handleBan(userId: string) {
  try {
    await banUser(userId, { banReason: 'Violación de términos' })
    toast.add({ title: 'Usuario baneado' })
  } catch (error) {
    toast.add({ title: error.message, color: 'error' })
  }
}
```

---

### `useDashboard()` - Estado Compartido de UI

**Ubicación:** `app/composables/useDashboard.ts`

**Patrón:** Composable compartido con `createSharedComposable`

**Uso:**
- Control de estado del slideover de notificaciones
- Atajos de teclado globales

```typescript
const { isNotificationsSlideoverOpen } = useDashboard()
```

---

## Patrones y Buenas Prácticas

### 1. Patrón para Lectura de Datos (con SSR)

```typescript
export function useMyDataList() {
  const { checkPermission } = useRole()
  
  // Verificar permiso
  const canView = computed(() => checkPermission({ myResource: ['list'] }))
  
  return useFetch('/api/my-data', {
    key: 'my-data-list',
    immediate: canView.value,
    watch: [canView],
    getCachedData(key) {
      if (!canView.value) return null
      const nuxtApp = useNuxtApp()
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })
}
```

### 2. Patrón para Mutaciones (sin SSR)

```typescript
export function useMyDataMutations() {
  const { isAdmin, checkPermission } = useRole()
  const nuxtApp = useNuxtApp()
  
  const invalidateCache = () => {
    delete nuxtApp.payload.data['my-data-list']
    refreshNuxtData('my-data-list')
  }
  
  const createItem = async (data: CreateDTO) => {
    if (!checkPermission({ myResource: ['create'] })) {
      throw new Error('No autorizado')
    }
    
    const response = await $fetch('/api/my-data', {
      method: 'POST',
      body: data
    })
    
    invalidateCache()
    return response
  }
  
  return { createItem }
}
```

### 3. Patrón para Componentes con Datos de Usuario

```vue
<script setup lang="ts">
// Para datos del usuario (SSR-safe)
const { user } = await useAuthSSR()

// Para acciones (solo cliente)
const { signOut } = useAuth()

// Para roles/permisos (reactivo en cliente)
const { isAdmin, checkPermission } = useRole()
</script>
```

---

## Creando un Nuevo Composable

### Checklist antes de crear

- [ ] ¿Necesita datos del usuario? → Decidir entre `useAuth()` o `useAuthSSR()`
- [ ] ¿Requiere permisos? → Usar `useRole()` con `checkPermission()`
- [ ] ¿Es lectura o mutación? → Elegir patrón adecuado
- [ ] ¿Necesita caché? → Configurar `getCachedData` si es lectura

### Template para nuevo composable de API

```typescript
/**
 * Composable para [descripción]
 * 
 * PERMISOS REQUERIDOS:
 * - [recurso]: [acciones]
 * 
 * SSR: [Sí/No] - [explicación breve]
 */
export function useMyFeatureList() {
  const { checkPermission } = useRole()
  
  const canView = computed(() => checkPermission({ myResource: ['list'] }))
  
  return useFetch<MyResponse>('/api/my-resource', {
    key: 'my-resource-list',
    immediate: canView.value,
    watch: [canView]
  })
}

export function useMyFeatureMutations() {
  const { checkPermission } = useRole()
  const nuxtApp = useNuxtApp()
  
  const invalidateCache = () => {
    delete nuxtApp.payload.data['my-resource-list']
    refreshNuxtData('my-resource-list')
  }
  
  const create = async (data: CreateDTO) => {
    if (!checkPermission({ myResource: ['create'] })) {
      throw new Error('No autorizado: Se requiere permiso myResource:create')
    }
    
    const result = await $fetch('/api/my-resource', {
      method: 'POST',
      body: data
    })
    
    invalidateCache()
    return result
  }
  
  return { create }
}
```

---

## Resumen Rápido

| Composable | SSR Safe | Uso Principal |
|------------|----------|---------------|
| `useAuthSSR()` | ✅ | Obtener datos de usuario en servidor |
| `useAuth()` | ❌ | Acciones de auth (login, logout) |
| `useRole()` | ⚠️ | Verificar roles y permisos en UI |
| `useUsersList()` | ✅ | Leer lista de usuarios |
| `useUsersMutations()` | ❌ | Crear/modificar/eliminar usuarios |
| `useDashboard()` | ✅ | Estado compartido de UI |

**Leyenda:**
- ✅ = Funciona correctamente en SSR
- ❌ = Solo funciona en cliente
- ⚠️ = Funciona pero puede tener limitaciones en SSR
