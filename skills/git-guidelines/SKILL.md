---
name: git-guidelines
description: >
  Guías para Git y GitHub: mensajes de commit, descripciones de PR.
  Usa GitHub CLI (gh) cuando esté disponible, con confirmación antes de comandos remotos.
  Trigger: Cuando el usuario pide crear commit, mensaje de commit, o descripción de PR.
license: MIT
metadata:
  author: conasin-team
  version: "2.2"
  scope: [root]
  auto_invoke: "Creando commits, PRs, o usando templates de GitHub"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## When to Use

- Antes de ejecutar `git commit`
- Cuando el usuario dice "haz el commit"
- Cuando el usuario pide crear/generar descripción de PR

---

## Critical Patterns

### Convenciones de Commit

| Regla | Ejemplo Correcto |
|-------|-----------------|
| Máx 100 caracteres | `feat(users): add email validation` |
| Sin mayúscula inicial | `fix(auth): handle token expiry` |
| Sin punto final | `docs(readme): update setup steps` |
| Tipo en minúscula | `feat:` / `fix:` / `docs:` |

**Tipos permitidos:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

### Confirmación Requerida

**⚠️ SIEMPRE confirmar antes de:**
- `git push`
- `gh pr create`
- `gh pr merge`

---

## Resources

- **Ejemplos**: Ver [assets/examples.md](assets/examples.md)
