---
name: skill-sync
description: >
  Sincroniza metadata de skills a AGENTS.md.
  Trigger: Después de crear o modificar un skill, regenerar tablas Auto-invoke.
license: MIT
metadata:
  author: conasin-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Después de crear/modificar un skill|Regenerar tablas Auto-invoke de AGENTS.md"
allowed-tools: Read, Edit, Write, Bash
---

## When to Use

Usa esta skill cuando:
- Creas o modificas un skill
- Necesitas regenerar la tabla de Auto-invoke en AGENTS.md
- Cambias el metadata (auto_invoke, scope) de un skill

---

## Commands

```bash
# Sincronizar skills con AGENTS.md
./skills/skill-sync/assets/sync.sh

# Modo dry-run (ver cambios sin aplicar)
./skills/skill-sync/assets/sync.sh --dry-run

# Mostrar ayuda
./skills/skill-sync/assets/sync.sh --help
```

---

## Resources

- **Script**: [assets/sync.sh](assets/sync.sh)
- **Template SKILL**: Ver [skill-creator/assets/SKILL-TEMPLATE.md](../skill-creator/assets/SKILL-TEMPLATE.md)
