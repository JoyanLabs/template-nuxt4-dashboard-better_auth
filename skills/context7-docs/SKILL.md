---
name: context7-docs
description: >
  Consulta documentación actualizada de librerías vía Context7 MCP.
  Trigger: Buscando documentación o buenas prácticas de librerías externas.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Buscando documentación o buenas prácticas"
allowed-tools: Read, Edit, Write, Bash
---

## When to Use

Usa esta skill cuando:
- Necesitas documentación actualizada de una librería
- Quieres ejemplos específicos de una API

---

## Commands

```bash
# Resolver ID de librería
mcp context7 resolve-library-id \
  --query "nuxt framework" \
  --libraryName "nuxt"

# Consultar documentación
mcp context7 query-docs \
  --libraryId "/nuxt/nuxt" \
  --query "cómo usar composables"
```

---

## Library IDs Comunes

| Librería | Context7 ID |
|----------|-------------|
| Nuxt | `/nuxt/nuxt` |
| Vue | `/vuejs/vue` |
| Nuxt UI | `/nuxt/ui` |

---

## Resources

- **Context7**: https://context7.com/
