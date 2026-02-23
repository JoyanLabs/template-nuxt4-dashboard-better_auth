---
name: typescript
description: >
  Patrones de TypeScript: const types, flat interfaces, utility types.
  Trigger: Cuando se escriben tipos, interfaces, generics o se trabaja con TypeScript avanzado.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Escribiendo tipos/interfaces TypeScript"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usa esta skill cuando:
- Creas o modificas tipos/interfaces
- Usas generics avanzados
- Necesitas utility types

---

## Critical Patterns

### 1. Flat Interfaces

```typescript
// ✅ BIEN - Plano
interface User {
  profileName: string;
  profileEmail: string;
}
```

### 2. Const Types

```typescript
const ROLES = ['admin', 'user'] as const
type Role = typeof ROLES[number]
```

---

## Resources

- **TypeScript Docs**: https://www.typescriptlang.org/docs/
