# Repository Guidelines - Nuxt 4 Dashboard Template

## Cómo Usar Esta Guía

- Empieza aquí para normas generales del proyecto.
- Cada skill tiene un archivo `SKILL.md` con patrones específicos.
- Para preguntas generales: `Read skills/template-frontend/SKILL.md`

---

## Available Skills

Usa estos skills para patrones detallados bajo demanda:

### Skills Genéricos

| Skill | Descripción | URL |
|-------|-------------|-----|
| `typescript` | Const types, flat interfaces, utility types | [SKILL.md](skills/typescript/SKILL.md) |
| `zod-4` | API de Zod 4, validación de schemas | [SKILL.md](skills/zod-4/SKILL.md) |
| `context7-docs` | Consulta documentación actualizada via MCP | [SKILL.md](skills/context7-docs/SKILL.md) |
| `vue-animations` | Transiciones Vue y animaciones Tailwind | [SKILL.md](skills/vue-animations/SKILL.md) |

### Skills Específicos del Template

| Skill | Descripción | URL |
|-------|-------------|-----|
| `template-frontend` | Overview del proyecto, arquitectura Nuxt 4 | [SKILL.md](skills/template-frontend/SKILL.md) |
| `better-auth` | Cliente de auth, hooks, roles y permisos | [SKILL.md](skills/better-auth/SKILL.md) |
| `git-guidelines` | Commits, PRs con GitHub CLI | [SKILL.md](skills/git-guidelines/SKILL.md) |
| `dashboard-patterns` | Dashboards con tabs, listado-detalle | [SKILL.md](skills/dashboard-patterns/SKILL.md) |
| `table-patterns` | Tablas interactivas con UiDataTable | [SKILL.md](skills/table-patterns/SKILL.md) |
| `nuxt-charts` | Visualizaciones con LineChart, BarChart | [SKILL.md](skills/nuxt-charts/SKILL.md) |
| `documentation` | Mejores prácticas de documentación | [SKILL.md](skills/documentation/SKILL.md) |

### Meta Skills

| Skill | Descripción | URL |
|-------|-------------|-----|
| `skill-creator` | Crear nuevos AI agent skills | [SKILL.md](skills/skill-creator/SKILL.md) |
| `skill-sync` | Sincronizar metadata a AGENTS.md | [SKILL.md](skills/skill-sync/SKILL.md) |
| `skill-auditor` | Auditar y revisar calidad de skills | [SKILL.md](skills/skill-auditor/SKILL.md) |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Buscando documentación o buenas prácticas | `context7-docs` |
| Creando commits, PRs, o usando templates de GitHub | `git-guidelines` |
| Creando nuevos skills | `skill-creator` |
| Creando o actualizando documentación | `documentation` |
| Creando schemas Zod | `zod-4` |
| Después de crear/modificar un skill | `skill-sync` |
| Escribiendo tipos/interfaces TypeScript | `typescript` |
| Implementando tablas con UiDataTable | `table-patterns` |
| Implementando dashboards con tabs | `dashboard-patterns` |
| Implementando gráficos | `nuxt-charts` |
| Preguntas generales sobre el template | `template-frontend` |
| Regenerar tablas Auto-invoke de AGENTS.md | `skill-sync` |
| Trabajando con autenticación o permisos | `better-auth` |
| Auditar o revisar skills existentes | `skill-auditor` |
| Validar skills contra código real | `skill-auditor` |

---

## Project Overview

Nuxt 4 Dashboard Template es un frontend moderno construido con Nuxt 4.

| Componente | Tecnología |
|------------|------------|
| Framework | Nuxt 4 |
| UI Library | Nuxt UI v4 |
| Lenguaje | TypeScript 5 |
| Autenticación | Better Auth (Client) |
| Estilos | Tailwind CSS 4 |
| Validación | Zod 4 |
| Testing | Vitest |

---

## Estructura del Proyecto

```
app/
├── assets/                 # Estilos, fuentes, imágenes
├── components/             # Componentes Vue (+ Nuxt UI)
├── composables/            # Lógica reactiva y llamadas API
├── layouts/                # Layouts de página
├── lib/                    # Librerías y configuraciones (Auth)
├── middleware/             # Guardias de navegación
├── pages/                  # Estructura de rutas
├── plugins/                # Plugins de Nuxt
└── utils/                  # Utilidades y schemas Zod
```

---

## Development Commands

```bash
# Desarrollo
pnpm dev                    # Inicia servidor de desarrollo
pnpm build                  # Compila el proyecto
pnpm preview                # Previsualiza build productivo

# Calidad de Código
pnpm lint                   # Ejecuta ESLint
pnpm typecheck              # Verifica tipos con vue-tsc
```

---

## Commit & Pull Request Guidelines

Seguir estilo conventional-commit: `<type>[scope]: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

**Examples:**
- `feat(auth): add logout functionality`
- `fix(users): update user list on creation`
- `docs(readme): add environment variables table`
