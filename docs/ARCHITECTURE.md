# Arquitectura del Frontend

Visión general de la arquitectura del Nuxt 4 Dashboard Template.

## Tabla de Contenidos

- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura de Nuxt 4](#estructura-de-nuxt-4)
- [Patrones de Diseño](#patrones-de-diseño)
- [Flujo de Autenticación](#flujo-de-autenticación)
- [Recursos](#recursos)

---

## Resumen Ejecutivo

Este template utiliza **Nuxt 4** como framework principal, aprovechando su nueva estructura de directorios y capacidades de SSR (Server Side Rendering).

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Nuxt** | 4.3.x | Framework SSR/SSG |
| **Vue** | 3.x | Framework reactivo |
| **TypeScript** | 5.7.x | Lenguaje |
| **Nuxt UI** | 4.4.x | Sistema de componentes |
| **Tailwind CSS** | 4.1.x | Framework CSS |
| **Better Auth** | 1.4.x | Autenticación cliente |
| **Zod** | 4.3.x | Validación |

## Estructura de Nuxt 4

```
app/
├── assets/                 # Estilos, imágenes
├── components/             # Componentes Vue
├── composables/            # Lógica reactiva
├── layouts/                # Layouts de página
├── lib/                    # Configuraciones (Auth)
├── middleware/             # Protección de rutas
├── pages/                  # Rutas automáticas
└── utils/                  # Utilidades y schemas
```

## Patrones de Diseño

### Composables

- **Lectura**: Usan `useFetch` para SSR y caché
- **Mutaciones**: Usan `$fetch` para POST/PUT/DELETE

### Validación

Utilizamos **Zod 4** para schemas de validación.

### Control de Acceso

Sistema de permisos con **Better Auth** coordinado con el backend.

## Flujo de Autenticación

```
1. Middleware global verifica sesión
2. Si no hay sesión → Redirect a /login
3. Login crea sesión con cookies HTTP-only
4. Redirect a página original
```

---

## Recursos

### Skills Relacionados
- [template-frontend](../skills/template-frontend/SKILL.md)
- [better-auth](../skills/better-auth/SKILL.md)
- [dashboard-patterns](../skills/dashboard-patterns/SKILL.md)

---

**Versión**: 1.0  
**Última actualización**: 2026-02-16
