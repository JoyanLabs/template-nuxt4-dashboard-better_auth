---
name: better-auth
description: >
  Integración de Better Auth en el cliente (frontend) con Nuxt.
  Trigger: Cuando se trabaja con autenticación del lado del cliente, sesiones, roles o permisos.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Trabajando con autenticación o permisos en el cliente"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usa esta skill cuando:
- Implementas autenticación en el frontend (signIn, signUp, signOut)
- Trabajas con sesiones de usuario y SSR
- Necesitas verificar roles o permisos en componentes
- Creas middlewares de protección de rutas
- Manejas control de acceso (Access Control) con Better Auth

**NO usar esta skill cuando:**
- Preguntas son generales sobre el proyecto → Usar `template-frontend`
- Validas datos de formularios → Usar `zod-4`
- Trabajas con tipos TypeScript → Usar `typescript`
- Consultas documentación de librerías → Usar `context7-docs`

---

## Arquitectura del Cliente

```
app/
├── lib/
│   ├── auth-client.ts           # Cliente de Better Auth
│   └── permissions.ts           # Definición de roles y permisos (AC)
├── composables/
│   ├── useAuth.ts               # Acciones de auth (signIn, signOut)
│   └── useRole.ts               # Verificación de roles y permisos
└── middleware/
    ├── auth.global.ts           # Verificación de sesión global
    ├── admin.ts                 # Solo administradores
    └── [feature].ts             # Middlewares personalizados
```

---

## Critical Patterns

### 1. Cliente de Better Auth

**Ubicación**: `app/lib/auth-client.ts`

```typescript
import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { ac, roles } from '~/lib/permissions'

// Obtener baseURL de variables de entorno
const getBaseURL = () => {
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: 'include' // Necesario para cookies HTTP-only
  },
  plugins: [
    adminClient({
      ac,
      roles
    })
  ]
})

export const { signIn, signUp, signOut, useSession } = authClient
```

**✅ Mejores Prácticas:**
- Usar `baseURL` dinámico (cliente: `window.location.origin`, servidor: env var)
- Incluir `credentials: 'include'` para cookies HTTP-only
- Configurar `adminClient` con `ac` (access control) y `roles`

---

### 2. Composable SSR-Safe (CRÍTICO para Nuxt)

**Ubicación**: `app/composables/useAuth.ts`

```typescript
import { useAuthFetch } from '~/composables/useAuthFetch'
import { authClient } from '~/lib/auth-client'

interface User {
  id: string
  email: string
  name: string
  role?: 'user' | 'admin' | 'moderator'
  banned?: boolean
  [key: string]: unknown
}

/**
 * Composable SSR-Safe para páginas con Server-Side Rendering
 * 
 * ✅ Usar en: pages/ (script setup de páginas)
 * ✅ Usar con: await (es async)
 * ⚠️ Importante: Pasa useAuthFetch para que cookies funcionen en SSR
 */
export async function useAuthSSR() {
  const { data: sessionData } = await authClient.useSession(useAuthFetch)
  const user = computed(() => sessionData.value?.user)
  const session = computed(() => sessionData.value?.session)
  const isLoading = computed(() => !sessionData.value)

  return {
    user,
    session,
    isLoading
  }
}
```

---

### 3. Wrapper useAuthFetch (Solución Cookies SSR)

**Ubicación**: `app/composables/useAuthFetch.ts`

```typescript
import type { UseFetchOptions } from '#app'

/**
 * Wrapper de useFetch para Better Auth en SSR
 * 
 * PROBLEMA: useFetch con URLs absolutas no reenvía cookies HTTP-only en SSR
 * SOLUCIÓN: Convertir URLs absolutas a rutas relativas
 * 
 * Referencia: https://github.com/better-auth/better-auth/issues/2175
 */
export function useAuthFetch<T>(url: string | Request, options?: UseFetchOptions<T>) {
  const urlString = typeof url === 'string' ? url : url.url
  // Convertir a ruta relativa: http://localhost:4005/api/auth/get-session -> /api/auth/get-session
  const relativeUrl = urlString.replace(/^https?:\/\/[^/]+/, '')
  return useFetch(relativeUrl, options)
}
```

**⚠️ CRÍTICO**: Este wrapper es necesario para que las cookies HTTP-only funcionen correctamente en SSR con Nuxt.

---

### 4. Composable para Acciones (Cliente)

**Ubicación**: `app/composables/useAuth.ts` (mismo archivo)

```typescript
/**
 * Composable para acciones de autenticación (cliente only)
 * 
 * ⚠️ NO usar en páginas con SSR (puede causar hidratación mismatch)
 * ✅ Usar para: signIn, signOut, signUp en componentes
 */
export function useAuth() {
  const sessionResponse = authClient.useSession()

  const user = computed(() => sessionResponse.value.data?.user as User | null)
  const session = computed(() => sessionResponse.value.data?.session)
  const isLoading = computed(() => sessionResponse.value.isPending)
  const error = computed(() => sessionResponse.value.error?.message || null)

  async function signIn(email: string, password: string) {
    try {
      const result = await authClient.signIn.email({ email, password })
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      return { success: true, user: result.data?.user }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      return { success: false, error: message }
    }
  }

  async function signUp(email: string, password: string, name: string) {
    try {
      const result = await authClient.signUp.email({ email, password, name })
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      return { success: true, user: result.data?.user }
    } catch (err: unknown) {
      return { success: false, error: 'Error al registrarse' }
    }
  }

  async function signOut() {
    try {
      await authClient.signOut()
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: 'Error al cerrar sesión' }
    }
  }

  async function requestPasswordReset(email: string) {
    try {
      const result = await authClient.forgetPassword({ email })
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: 'Error al solicitar reset' }
    }
  }

  async function resetPassword(token: string, password: string) {
    try {
      const result = await authClient.resetPassword({ token, password })
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: 'Error al resetear contraseña' }
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    resetPassword
  }
}
```

---

### 5. Sistema de Permisos (Access Control)

**Ubicación**: `app/lib/permissions.ts`

```typescript
import { createAccessControl } from 'better-auth/plugins/access'

/**
 * Statements: Define recursos y acciones disponibles
 * IMPORTANTE: Mantener sincronizado con backend
 */
export const statement = {
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
} as const

// Access Control instance
export const ac = createAccessControl(statement)

// Definición de roles
export const admin = ac.newRole({
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
})

export const moderator = ac.newRole({
  user: ['list', 'ban'],
  session: ['list']
})

export const user = ac.newRole({
  session: []
})

// Objeto roles para el plugin
export const roles = { admin, moderator, user }

// Tipo para nombres de roles
export type RoleName = keyof typeof roles
```

**✅ Mejores Prácticas:**
- Usar `as const` para type inference
- Importar desde `'better-auth/plugins/access'` (no del plugin principal)
- Exportar tanto `ac` como `roles`
- **⚠️ CRÍTICO**: Sincronizar con el backend

---

### 6. Composable de Roles y Permisos

**Ubicación**: `app/composables/useRole.ts`

```typescript
/**
 * Composable para verificar roles y permisos
 * 
 * ✅ Usar en: Cliente (componentes, lógica)
 * ⚠️ Mejor en: Cliente después de autenticación
 */
export function useRole() {
  const { user } = useAuth()
  
  // Computed de roles
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => user.value?.role === 'moderator')
  const isUser = computed(() => user.value?.role === 'user')
  const isBanned = computed(() => user.value?.banned ?? false)
  
  const currentRole = computed<RoleName>(() => {
    return (user.value?.role as RoleName) || 'user'
  })
  
  // Verificar rol simple
  const hasRole = (role: RoleName | RoleName[]) => {
    if (!user.value) return false
    
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(currentRole.value)
  }
  
  // Verificar permiso (síncrono - para UI)
  const checkPermission = (permission: Record<string, string[]>) => {
    if (!user.value) return false
    if (isAdmin.value) return true // Admins tienen todo
    
    // Aquí implementar lógica según tus permisos
    const [resource, actions] = Object.entries(permission)[0]
    
    if (resource === 'user') {
      if (isModerator.value) {
        return actions.some(action => ['list', 'ban'].includes(action))
      }
    }
    
    return false
  }
  
  // Verificar permiso (asíncrono - para operaciones críticas)
  const hasPermission = async (permission: Record<string, string[]>) => {
    // En el cliente, generalmente usamos checkPermission
    // Pero podemos verificar con el backend si es crítico
    return checkPermission(permission)
  }
  
  return {
    // Computed
    isAdmin,
    isModerator,
    isUser,
    currentRole,
    isBanned,
    
    // Funciones
    hasRole,
    checkPermission,
    hasPermission
  }
}
```

---

### 7. Middleware Global de Autenticación

**Ubicación**: `app/middleware/auth.global.ts`

```typescript
export default defineNuxtRouteMiddleware(async (to) => {
  // Excepciones (páginas públicas)
  if (to.path === '/login' || to.path === '/signup') {
    return
  }
  
  // Verificar sesión
  const { user } = await useAuthSSR()
  
  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
```

---

### 8. Middleware de Rol

**Ubicación**: `app/middleware/admin.ts`

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { hasRole } = useRole()
  
  if (!hasRole('admin')) {
    return navigateTo({
      path: '/',
      query: { 
        error: 'unauthorized',
        message: 'Se requiere rol de administrador'
      }
    })
  }
})
```

**Uso en página**:
```vue
<script setup>
definePageMeta({
  middleware: 'admin'
})
</script>
```

---

### 9. Middleware de Permiso

**Ubicación**: `app/middleware/user-management.ts`

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { checkPermission, isAdmin } = useRole()
  
  // Admins siempre tienen acceso
  if (isAdmin.value) {
    return
  }
  
  // Verificar permiso específico
  const hasPermission = checkPermission({ user: ['list'] })
  
  if (!hasPermission) {
    return navigateTo({
      path: '/',
      query: { 
        error: 'forbidden',
        message: 'No tiene permisos para gestionar usuarios'
      }
    })
  }
})
```

---

## Patrones de Uso

### En Componentes - Mostrar/Ocultar UI

```vue
<script setup lang="ts">
const { isAdmin, checkPermission } = useRole()
</script>

<template>
  <!-- Por rol -->
  <UButton v-if="isAdmin" @click="deleteAll">
    Admin Action
  </UButton>
  
  <!-- Por permiso específico -->
  <UButton v-if="checkPermission({ user: ['ban'] })" @click="banUser">
    Banear Usuario
  </UButton>
</template>
```

### En Lógica - Verificar antes de acción

```typescript
const { checkPermission } = useRole()

async function deleteUser(userId: string) {
  // Verificar permiso
  if (!checkPermission({ user: ['delete'] })) {
    throw new Error('No autorizado: Se requiere permiso user:delete')
  }
  
  // Ejecutar acción
  await $fetch(`/api/users/${userId}`, { method: 'DELETE' })
}
```

### En Páginas - Obtener usuario con SSR

```vue
<script setup lang="ts">
// Obtener usuario con SSR
const { user } = await useAuthSSR()

// Metadata de protección
definePageMeta({
  middleware: 'admin'
})
</script>

<template>
  <div>
    <h1>Bienvenido, {{ user?.name }}</h1>
  </div>
</template>
```

---

## Flujo de Autenticación

```
1. Usuario accede a página protegida
   └─ auth.global.ts intercepta

2. Middleware verifica sesión con useAuthSSR()
   ├─ SÍ tiene sesión → Continuar
   └─ NO tiene sesión → Redirect a /login

3. Usuario hace login
   └─ Componente usa useAuth().signIn()

4. Better Auth crea sesión
   └─ Cookies HTTP-only se establecen

5. Redirect a página original
   └─ Middleware verifica sesión exitosamente

6. Componentes usan datos del usuario
   ├─ useAuthSSR() para SSR
   └─ useAuth() para acciones
```

---

## Mejores Prácticas

### ✅ HACER

1. **Usar `useAuthSSR()` para datos en SSR**
   ```typescript
   const { user } = await useAuthSSR()
   ```

2. **Usar `useAuth()` para acciones**
   ```typescript
   const { signIn, signOut } = useAuth()
   ```

3. **Doble protección: middleware + UI**
   ```vue
   <script setup>
   definePageMeta({ middleware: 'admin' })
   const { isAdmin } = useRole()
   </script>
   
   <template>
     <UButton v-if="isAdmin">Admin Action</UButton>
   </template>
   ```

4. **Verificar permisos antes de acciones**
   ```typescript
   if (!checkPermission({ user: ['delete'] })) {
     throw new Error('No autorizado')
   }
   ```

5. **Sincronizar permisos con backend**
   - Frontend: `app/lib/permissions.ts`
   - Backend: Verificar en la documentación del backend

### ❌ NO HACER

1. **No usar `useAuth()` en SSR**
   ```typescript
   // ❌ MAL - user puede ser null en SSR
   const { user } = useAuth()
   
   // ✅ BIEN
   const { user } = await useAuthSSR()
   ```

2. **No omitir verificación de permisos**
   ```typescript
   // ❌ MAL - no verifica
   async function dangerousAction() {
     await $fetch('/api/dangerous')
   }
   
   // ✅ BIEN
   async function dangerousAction() {
     if (!checkPermission({ resource: ['action'] })) {
       throw new Error('No autorizado')
     }
     await $fetch('/api/dangerous')
   }
   ```

3. **No hardcodear roles**
   ```typescript
   // ❌ MAL
   if (user.role === 'admin') { }
   
   // ✅ BIEN
   if (isAdmin.value) { }
   ```

---

## Troubleshooting

### Usuario es null en SSR

**Problema**: `useAuth()` devuelve `user = null` en el servidor

**Solución**: Usar `useAuthSSR()` con `await`
```typescript
const { user } = await useAuthSSR()
```

### Permisos no funcionan

**Problema**: `checkPermission()` siempre devuelve false

**Solución**: Verificar sincronización con backend
```bash
# Comparar permisos entre frontend y backend
# Asegurar que ambos usan el mismo statement y roles
```

### Sesión no persiste

**Problema**: Usuario debe hacer login cada vez

**Solución**: Verificar que Better Auth esté configurado con cookies HTTP-only
```typescript
// En backend: better-auth.config.ts
export const auth = betterAuth({
  // ...
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7 // 7 días
    }
  }
})
```

### Cookies no funcionan en SSR

**Problema**: Sesión funciona en cliente pero no en SSR (hydration mismatch)

**Causa**: `useFetch` con URLs absolutas no reenvía cookies HTTP-only durante SSR

**Solución**: Usar `useAuthFetch` wrapper que convierte URLs a rutas relativas
```typescript
// app/composables/useAuth.ts
export async function useAuthSSR() {
  // ✅ Correcto: Pasa useAuthFetch
  const { data: sessionData } = await authClient.useSession(useAuthFetch)
  
  // ❌ Incorrecto: No pasar nada (usa fetch por defecto)
  const { data: sessionData } = await authClient.useSession()
}
```

**Referencia**: [Better Auth Issue #2175](https://github.com/better-auth/better-auth/issues/2175)

---

## Resources

- **Documentación Better Auth**: [https://better-auth.dev/](https://better-auth.dev/)
- **Better Auth Vue**: [https://better-auth.dev/docs/integrations/vue](https://better-auth.dev/docs/integrations/vue)
