---
name: skill-creator
description: >
  Crea nuevos AI agent skills siguiendo el estándar de agentskills.io.
  Trigger: Cuando se necesita crear un nuevo skill para el proyecto.
license: MIT
metadata:
  author: conasin-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Creando nuevos skills"
allowed-tools: Read, Edit, Write
---

## When to Use

Usa este skill cuando:
- Necesitas documentar un patrón técnico nuevo
- Identificas un workflow repetitivo
- Quieres encapsular conocimiento específico del proyecto

---

## Template SKILL.md

Usa este template como base:

```markdown
---
name: {skill-name}
description: >
  {Descripción del skill}.
  Trigger: {Cuándo la IA debería cargar este skill}.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "{Acción que dispara}"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usa este skill cuando:
- {Condición 1}
- {Condición 2}

---

## Critical Patterns

### Pattern 1: {Nombre}

\`\`\`{language}
{código de ejemplo}
\`\`\`

---

## Resources

- **Template**: [assets/SKILL-TEMPLATE.md](assets/SKILL-TEMPLATE.md)
```

---

## Resources

- **Template**: [assets/SKILL-TEMPLATE.md](assets/SKILL-TEMPLATE.md)
