# Nuxt Open Fetch - Guía de Implementación

Guía para implementar llamadas API type-safe con nuxt-open-fetch.

---

## Instalación

```bash
pnpm add nuxt-open-fetch
```

## Configuración

### 1. nuxt.config.ts

```typescript
export default defineNuxtConfig({
  modules: [
    'nuxt-open-fetch'
  ],

  openFetch: {
    api: {
      baseURL: '/api',
      schema: './openapi.json'
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
    }
  },

  routeRules: {
    '/api/users/**': {
      proxy: 'http://localhost:3001/api/users/**'
    }
  }
})
```

### 2. Plugin de Autenticación

Crear `app/plugins/openFetchAuth.ts`:

```typescript
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('openFetch:onRequest', (ctx) => {
    ctx.options.credentials = 'include'
  })

  nuxtApp.hook('openFetch:onRequest:api', (ctx) => {
    ctx.options.credentials = 'include'
  })
})
```

### 3. Descargar Schema OpenAPI

```bash
curl http://localhost:3001/api-json > openapi.json
```

---

## Composables Generados

Después de iniciar el servidor, se generan automáticamente:

| Nombre | Tipo | Uso |
|--------|------|-----|
| `useApi` | Composable | Queries con SSR |
| `useLazyApi` | Composable | Lazy loading |
| `nuxtApp.$api` | Método | Mutaciones (POST, PATCH, DELETE) |
| `ApiRequestBody` | Type | Tipado de body |
| `ApiResponse` | Type | Tipado de respuestas |

---

## Ejemplos de Uso

### Query (GET)

```vue
<script setup>
const { data: users, pending } = useApi('/api/users', {
  query: { limit: 10, page: 1 }
})
</script>
```

### Mutation (POST)

```vue
<script setup>
const nuxtApp = useNuxtApp()

async function createUser(userData) {
  const result = await nuxtApp.$api('/api/users', {
    method: 'POST',
    body: userData
  })
  return result
}
</script>
```

### Lazy Loading

```vue
<script setup>
// No bloquea el renderizado SSR
const { data: users } = useLazyApi('/api/users')
</script>
```

---

## Troubleshooting

### "useApi is not defined"

**Causa:** Los tipos no se han generado.

**Solución:**
```bash
rm -rf .nuxt && pnpm dev
```

### Cookies no se envían

**Causa:** Falta plugin de autenticación.

**Solución:** Crear `app/plugins/openFetchAuth.ts` con `credentials: 'include'`.

### "No match found for location"

**Causa:** Endpoint no está proxyeado.

**Solución:** Agregar routeRule en `nuxt.config.ts`.

---

## Recursos

- **Documentación**: https://nuxt-open-fetch.vercel.io/
- **Skill**: Ver `skills/context7-docs/SKILL.md` para consultar documentación actualizada
