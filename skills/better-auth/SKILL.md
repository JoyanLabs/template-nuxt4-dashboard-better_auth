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

---

## Arquitectura del Cliente

```
app/
├── lib/
│   ├── auth-client.ts           # Cliente de Better Auth
│   └── permissions.ts           # Definición de roles y permisos (admin, moderator, user)
├── composables/
│   ├── useAuth.ts               # Acciones de auth (signIn, signUp, signOut, requestPasswordReset, resetPassword)
│   └── useRole.ts               # Verificación de roles (isAdmin, isModerator, isUser, checkPermission)
└── middleware/
    ├── auth.global.ts           # Verificación de sesión global
    └── admin.ts                 # Solo administradores
```

---

## Critical Patterns

### 1. Cliente de Better Auth

```typescript
// app/lib/auth-client.ts
import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { ac, roles } from '~/lib/permissions'

export const authClient = createAuthClient({
  baseURL: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  fetchOptions: {
    credentials: 'include' // Necesario para cookies HTTP-only
  },
  plugins: [adminClient({ ac, roles })]
})

export const { signIn, signUp, signOut, useSession } = authClient
```

### 2. Composable SSR-Safe

```typescript
// app/composables/useAuth.ts
import { useAuthFetch } from '~/composables/useAuthFetch'
import { authClient } from '~/lib/auth-client'

export async function useAuthSSR() {
  const { data: sessionData } = await authClient.useSession(useAuthFetch)
  const user = computed(() => sessionData.value?.user)
  return { user }
}
```

### 3. Wrapper useAuthFetch

```typescript
// app/composables/useAuthFetch.ts
export function useAuthFetch<T>(url: string | Request, options?: any) {
  const urlString = typeof url === 'string' ? url : url.url
  const relativeUrl = urlString.replace(/^https?:\/\/[^/]+/, '')
  return useFetch(relativeUrl, options)
}
```

### 4. Sistema de Permisos (3 Roles)

```typescript
// app/lib/permissions.ts
import { createAccessControl } from 'better-auth/plugins/access'

export const statement = {
  user: ['create', 'list', 'set-role', 'ban', 'delete'],
  session: ['list', 'revoke']
} as const

export const ac = createAccessControl(statement)

// Admin: Control total
export const admin = ac.newRole({
  user: ['create', 'list', 'set-role', 'ban', 'delete'],
  session: ['list', 'revoke']
})

// Moderator: Permisos limitados
export const moderator = ac.newRole({
  user: ['list', 'ban'],
  session: ['list']
})

// User: Sin permisos administrativos
export const user = ac.newRole({ session: [] })

export const roles = { admin, moderator, user }
export type RoleName = keyof typeof roles
```

### 5. Middleware Global

```typescript
// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return
  
  const { user } = await useAuthSSR()
  
  if (!user.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
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
```

---

## Resources

- **Patrones**: Ver [assets/auth-patterns.ts](assets/auth-patterns.ts)
- **Documentación**: [docs/PERMISSIONS.md](../../docs/PERMISSIONS.md)
- **Better Auth**: https://better-auth.dev/
