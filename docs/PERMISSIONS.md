# Sistema de Permisos - SPP Frontend

Esta documentación explica cómo funciona el sistema de Access Control basado en Better Auth.

---

## 📋 Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Definición de Permisos](#definición-de-permisos)
3. [Roles Disponibles](#roles-disponibles)
4. [Cómo Usar Permisos](#cómo-usar-permisos)
5. [Sincronización con Backend](#sincronización-con-backend)
6. [Agregando Nuevos Permisos](#agregando-nuevos-permisos)

---

## Arquitectura del Sistema

El sistema usa **Better Auth Access Control** que permite:

1. **Definir recursos** (ej: `user`, `session`, `product`)
2. **Definir acciones por recurso** (ej: `create`, `delete`, `list`)
3. **Asignar permisos a roles** (ej: admin puede todo, moderator puede banear)

```
┌─────────────────────────────────────────────────────────┐
│                    Access Control                        │
├─────────────────────────────────────────────────────────┤
│  Statements (Recursos + Acciones)                       │
│  ├── user: [create, list, ban, delete, ...]            │
│  └── session: [list, revoke, delete]                   │
├─────────────────────────────────────────────────────────┤
│  Roles                                                  │
│  ├── admin: user[*], session[*]                        │
│  ├── moderator: user[list, ban], session[list]         │
│  └── user: session[]                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Definición de Permisos

**Ubicación:** `app/lib/permissions.ts`

### Statements (Recursos y Acciones)

```typescript
export const statement = {
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
} as const
```

| Recurso | Acciones Disponibles |
|---------|---------------------|
| `user` | create, list, set-role, ban, impersonate, delete, set-password, get, update |
| `session` | list, revoke, delete |

---

## Roles Disponibles

### `admin` - Control Total

```typescript
export const admin = ac.newRole({
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
})
```

| Permiso | ✅/❌ |
|---------|-------|
| Crear usuarios | ✅ |
| Listar usuarios | ✅ |
| Cambiar roles | ✅ |
| Banear usuarios | ✅ |
| Eliminar usuarios | ✅ |
| Gestionar sesiones | ✅ |

---

### `moderator` - Moderación Limitada

```typescript
export const moderator = ac.newRole({
  user: ['list', 'ban'],
  session: ['list']
})
```

| Permiso | ✅/❌ |
|---------|-------|
| Crear usuarios | ❌ |
| Listar usuarios | ✅ |
| Cambiar roles | ❌ |
| Banear usuarios | ✅ |
| Eliminar usuarios | ❌ |
| Ver sesiones | ✅ |

---

### `user` - Usuario Regular

```typescript
export const user = ac.newRole({
  session: []
})
```

| Permiso | ✅/❌ |
|---------|-------|
| Crear usuarios | ❌ |
| Listar usuarios | ❌ |
| Cambiar roles | ❌ |
| Banear usuarios | ❌ |
| Eliminar usuarios | ❌ |
| Gestionar sesiones | ❌ |

---

## Cómo Usar Permisos

### En Templates (v-if)

```vue
<script setup>
const { checkPermission, isAdmin } = useRole()
</script>

<template>
  <!-- Por rol -->
  <AdminPanel v-if="isAdmin" />
  
  <!-- Por permiso específico -->
  <BanButton v-if="checkPermission({ user: ['ban'] })" />
  
  <!-- Múltiples permisos (AND) -->
  <SuperButton v-if="checkPermission({ user: ['ban', 'delete'] })" />
</template>
```

### En Lógica de Componentes

```typescript
const { checkPermission, hasPermission } = useRole()

// Verificación síncrona (para UI)
function canShowDeleteButton() {
  return checkPermission({ user: ['delete'] })
}

// Verificación asíncrona (para operaciones críticas)
async function deleteUser(id: string) {
  const canDelete = await hasPermission({ user: ['delete'] })
  if (!canDelete) {
    throw new Error('No autorizado')
  }
  // ... proceder con eliminación
}
```

### En Composables

```typescript
export function useFeatureMutations() {
  const { checkPermission, isAdmin } = useRole()
  
  const doSomething = async () => {
    // Verificar permiso antes de actuar
    if (!checkPermission({ myResource: ['action'] })) {
      throw new Error('No autorizado: Se requiere permiso myResource:action')
    }
    
    // ... ejecutar acción
  }
  
  return { doSomething }
}
```

### En Middlewares

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { checkPermission } = useRole()
  
  if (!checkPermission({ user: ['list'] })) {
    return navigateTo('/')
  }
})
```

---

## Sincronización con Backend

⚠️ **IMPORTANTE**: Los permisos deben estar sincronizados entre frontend y backend.

**Archivo Frontend:** `app/lib/permissions.ts`
**Archivo Backend:** `spp-backend/src/shared/infrastructure/auth/permissions.ts`

### Checklist de Sincronización

Cuando modifiques permisos, asegúrate de:

- [ ] Actualizar `statement` en ambos archivos
- [ ] Actualizar roles afectados en ambos archivos
- [ ] Los strings deben coincidir **exactamente**
- [ ] Reiniciar ambos servidores después de cambios

---

## Agregando Nuevos Permisos

### Paso 1: Actualizar Statements

```typescript
// app/lib/permissions.ts
export const statement = {
  user: ['create', 'list', ...],
  session: ['list', 'revoke', 'delete'],
  // Agregar nuevo recurso
  product: ['create', 'read', 'update', 'delete', 'publish']
} as const
```

### Paso 2: Asignar a Roles

```typescript
export const admin = ac.newRole({
  user: [...],
  session: [...],
  product: ['create', 'read', 'update', 'delete', 'publish'] // Admin tiene todo
})

export const moderator = ac.newRole({
  user: ['list', 'ban'],
  session: ['list'],
  product: ['read', 'publish'] // Moderator solo lee y publica
})

export const user = ac.newRole({
  session: [],
  product: ['read'] // User solo lee
})
```

### Paso 3: Replicar en Backend

Copiar los mismos cambios a:
`spp-backend/src/shared/infrastructure/auth/permissions.ts`

### Paso 4: Usar en el Código

```typescript
// En composable
const { checkPermission } = useRole()

if (checkPermission({ product: ['publish'] })) {
  // Puede publicar productos
}
```

```vue
<!-- En template -->
<PublishButton v-if="checkPermission({ product: ['publish'] })" />
```

---

## Tabla de Comparación: Roles vs Permisos

| Criterio | `hasRole()` | `checkPermission()` |
|----------|-------------|---------------------|
| Granularidad | Baja (por rol) | Alta (por acción) |
| Flexibilidad | Baja | Alta |
| Mantenimiento | Fácil | Requiere sincronización |
| Uso recomendado | Verificaciones simples | Control fino de features |

### Cuándo usar cada uno

```typescript
// Simple: Solo admins pueden ver esto
if (isAdmin.value) showAdminPanel()

// Granular: Cualquier rol con permiso de banear
if (checkPermission({ user: ['ban'] })) showBanButton()
```

---

## Tipos Disponibles

```typescript
import type { RoleName } from '~/lib/permissions'

// 'admin' | 'moderator' | 'user'
const role: RoleName = 'admin'
```
