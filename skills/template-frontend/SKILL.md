---
name: template-frontend
description: >
  Overview del proyecto Nuxt 4 Dashboard Template y navegación de componentes.
  Trigger: Para preguntas generales sobre el frontend, estructura, componentes, composables o cómo empezar.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Preguntas generales sobre el template frontend"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Nuxt** | 4.3.x | Framework SSR/SSG |
| **Vue** | 3.x | Framework reactivo |
| **TypeScript** | 5.7.x | Lenguaje |
| **Nuxt UI** | 4.4.x | Sistema de componentes |
| **Tailwind CSS** | 4.1.x | Framework CSS |
| **Better Auth** | 1.4.x | Autenticación cliente |
| **Zod** | 4.3.x | Validación de schemas |

---

## Arquitectura

**Estructura de Nuxt 4**:

```
app/
├── assets/                 # Recursos estáticos (CSS, imágenes)
├── components/             # Componentes Vue reutilizables
├── composables/            # Lógica reactiva compartida
├── layouts/                # Layouts de página
├── lib/                    # Configuraciones y utilidades (Better Auth)
├── middleware/             # Protección de rutas
├── pages/                  # Rutas automáticas
├── plugins/                # Plugins de Nuxt
└── utils/                  # Funciones utilitarias y schemas
```

---

## Patrones de Código

### Composables
- **Lectura**: Usan `useFetch` para SSR y caché
- **Mutaciones**: Usan `$fetch` para POST/PUT/DELETE

### Validación
Utilizamos **Zod 4** para schemas de validación.

### Control de Acceso
Sistema de permisos con **Better Auth** coordinado con el backend.

---

## Skills Disponibles

| Skill | Cuándo Usar |
|-------|-------------|
| `better-auth` | Autenticación, sesiones, roles |
| `dashboard-patterns` | Dashboards con tabs |
| `table-patterns` | Tablas interactivas |
| `nuxt-charts` | Gráficos y visualizaciones |
| `git-guidelines` | Commits y PRs |
| `zod-4` | Schemas de validación |
| `documentation` | Crear documentación |

---

## Comandos Principales

```bash
# Desarrollo
pnpm dev                    # Servidor de desarrollo
pnpm build                  # Build de producción
pnpm preview                # Preview del build

# Calidad
pnpm lint                   # Linter (ESLint)
pnpm typecheck              # Verificación de tipos
```

---

## Configuración de Proxy

El backend corre en `http://localhost:3001`. Configurar en `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  routeRules: {
    '/api/auth/**': {
      proxy: 'http://localhost:3001/api/auth/**'
    },
    '/api/users/**': {
      proxy: 'http://localhost:3001/api/users/**'
    }
  }
})
```

---

## Flujo de Autenticación

1. Usuario accede a página protegida
2. `auth.global.ts` intercepta y verifica sesión
3. Si no hay sesión → Redirect a `/login`
4. Login usa `useAuth().signIn()`
5. Better Auth crea sesión con cookies HTTP-only
6. Redirect a página original

---

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) | Arquitectura y patrones Nuxt 4 |
| [docs/SETUP.md](../docs/SETUP.md) | Configuración inicial |
| [docs/COMPOSABLES.md](../docs/COMPOSABLES.md) | Sistema de composables |
| [docs/PERMISSIONS.md](../docs/PERMISSIONS.md) | Control de acceso |
| [docs/THEMING.md](../docs/THEMING.md) | Temas y Tailwind CSS |

---

## Context7 MCP

Para documentación actualizada de cualquier librería, consulta el skill `context7-docs`.
