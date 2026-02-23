# Setup - Configuración Inicial

Guía para configurar el proyecto por primera vez.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Recursos](#recursos)

---

## Requisitos

- Node.js 20+
- pnpm
- Backend corriendo (ver template-nestjs-dashboard-better_auth)

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd template-nuxt4-dashboard-better_auth

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

## Configuración

### Variables de Entorno

```env
# URL del backend
NUXT_PUBLIC_API_URL=http://localhost:3001

# Better Auth
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### nuxt.config.ts

Asegúrate de configurar los proxies para el backend:

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

## Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# La aplicación estará en http://localhost:3000
```

---

## Recursos

### Skills Relacionados
- [template-frontend](../skills/template-frontend/SKILL.md)
- [better-auth](../skills/better-auth/SKILL.md)

---

**Versión**: 1.0  
**Última actualización**: 2026-02-16
