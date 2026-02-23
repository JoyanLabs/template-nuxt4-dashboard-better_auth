---
name: zod-4
description: >
  Patrones de validación con Zod 4.
  Trigger: Cuando se crean o actualizan schemas Zod v4 para validación/parsing (forms, payloads, DTOs).
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Creando schemas Zod"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usa esta skill cuando:
- Creas o actualizas schemas de validación
- Validas datos de formularios
- Parseas payloads de API

---

## Breaking Changes desde Zod 3

```typescript
// ❌ Zod 3
z.string().email()
z.string().nonempty()

// ✅ Zod 4
z.email()
z.string().min(1)
```

---

## Schemas Básicos

```typescript
import { z } from "zod"

const emailSchema = z.email()
const nameSchema = z.string().min(1).max(100)

const userSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
})

type User = z.infer<typeof userSchema>
```

---

## Resources

- **Zod Docs**: https://zod.dev/
