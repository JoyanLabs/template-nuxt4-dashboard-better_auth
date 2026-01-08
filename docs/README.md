# Documentación del Frontend - SPP

Bienvenido a la documentación del frontend de SPP. Aquí encontrarás guías detalladas sobre cómo funcionan los diferentes sistemas del proyecto.

---

## 📚 Índice de Documentación

### 1. [Desarrollo de Features](./FEATURE-DEVELOPMENT.md) ⭐ NUEVO
Guía completa full-stack para implementar nuevas funcionalidades:
- Flujo completo: Backend → Frontend → UI
- DTOs y Controllers en NestJS
- Schemas de validación con Zod
- Composables de lectura y mutaciones
- Componentes de Nuxt UI (modales, formularios)
- Checklist de implementación

### 2. [Composables](./COMPOSABLES.md)
Guía completa de todos los composables del proyecto:
- `useAuth()` vs `useAuthSSR()` - Cuándo usar cada uno
- `useRole()` - Verificación de permisos granulares
- `useUsersList()` / `useUsersMutations()` - Patrón de lectura/escritura
- Patrones para crear nuevos composables

### 3. [Middlewares](./MIDDLEWARES.md)
Sistema de protección de rutas:
- Middleware global de autenticación
- Middlewares de roles y permisos
- Cómo crear middlewares personalizados
- Flujo de autenticación

### 4. [Permisos](./PERMISSIONS.md)
Sistema de Access Control:
- Definición de recursos y acciones
- Roles disponibles (admin, moderator, user)
- Cómo agregar nuevos permisos
- Sincronización con el backend

---

## 🚀 Guía Rápida

### ¿Quiero crear una nueva funcionalidad completa?
→ Seguir [FEATURE-DEVELOPMENT.md](./FEATURE-DEVELOPMENT.md)

### ¿Necesito mostrar datos del usuario en SSR?
→ Usar `useAuthSSR()`

### ¿Necesito un botón de logout?
→ Usar `useAuth()` para `signOut()`

### ¿Necesito ocultar un botón según permisos?
→ Usar `useRole()` con `checkPermission()`

### ¿Necesito proteger una ruta completa?
→ Usar middleware con `definePageMeta()`

### ¿Necesito crear un composable de API?
→ Ver patrones en [COMPOSABLES.md](./COMPOSABLES.md#creando-un-nuevo-composable)

### ¿Necesito crear un modal con formulario?
→ Ver patrones de Nuxt UI en [FEATURE-DEVELOPMENT.md](./FEATURE-DEVELOPMENT.md#patrones-de-nuxt-ui)

---

## 📁 Estructura de Archivos Relevantes

```
app/
├── composables/
│   ├── useAuth.ts          # Autenticación SSR y cliente
│   ├── useAuthFetch.ts     # Wrapper para fetch con cookies
│   ├── useRole.ts          # Verificación de roles/permisos
│   ├── useUsersAPI.ts      # API de usuarios (ejemplo)
│   └── useDashboard.ts     # Estado UI compartido
├── middleware/
│   ├── auth.global.ts      # Verificación de sesión (global)
│   ├── admin.ts            # Solo administradores
│   └── user-management.ts  # Permisos de gestión
├── lib/
│   ├── auth-client.ts      # Cliente de Better Auth
│   └── permissions.ts      # Definición de permisos
├── utils/
│   └── user.schema.ts      # Schemas Zod para validación
├── components/
│   └── settings/
│       ├── UsersList.vue   # Lista de usuarios
│       └── users/          # Modales de gestión
│           ├── UserCreateModal.vue
│           ├── UserEditModal.vue
│           ├── UserDeleteModal.vue
│           ├── UserBanModal.vue
│           └── UserPasswordModal.vue
└── pages/
    └── settings/
        └── users.vue       # Página de gestión de usuarios
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Nuxt 4** | Framework SSR |
| **Nuxt UI** | Componentes (Modal, Form, Button, etc.) |
| **Zod** | Validación de schemas |
| **Better Auth** | Autenticación |
| **TypeScript** | Tipado estático |

---

## 📋 Flujo de Desarrollo Recomendado

```
1. Backend (NestJS)
   └── DTOs → Controllers → Endpoints

2. Frontend (Nuxt)
   └── Schemas Zod → Composables → Componentes → Páginas

3. Testing
   └── Probar flujo completo → Verificar permisos → UI/UX
```

Para una guía paso a paso detallada, ver [FEATURE-DEVELOPMENT.md](./FEATURE-DEVELOPMENT.md).

---

## 🔗 Referencias Externas

- [Better Auth Documentation](https://better-auth.dev/)
- [Nuxt 4 Composables](https://nuxt.com/docs/api/composables)
- [Nuxt UI Components](https://ui.nuxt.com/)
- [Zod Documentation](https://zod.dev/)
- [Vue 3 Reactivity](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
