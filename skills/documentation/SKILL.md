---
name: documentation
description: >
  Crea y mantiene documentación del proyecto siguiendo estándares.
  Trigger: Cuando se crea nueva funcionalidad, se modifica arquitectura, o se necesita documentar patrones.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Creando o actualizando documentación"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usar este skill cuando:
- Se implementa una nueva funcionalidad que necesita documentación
- Se crea un nuevo contexto o módulo
- Se modifica la arquitectura del proyecto
- Se detecta documentación desactualizada

---

## Principios de Documentación

### Jerarquía docs/ vs skills/

```
docs/                    # Para humanos (lectura continua, guías)
├── ARCHITECTURE.md      # Visión general
├── SETUP.md             # Configuración inicial
└── {feature}.md         # Guías específicas

skills/                  # Para IA (referencia rápida, patrones)
├── {skill}/
│   ├── SKILL.md         # Patrones críticos
│   └── references/      # Links a docs/
```

---

## Estructura de Documentos

### Ubicación según el tipo

```
¿Qué estás documentando?
├─ Arquitectura general?     → docs/ARCHITECTURE.md
├─ Funcionalidad específica? → docs/{FEATURE}.md
├─ Patrón reutilizable?      → docs/{PATTERN}.md
└─ Guía de operaciones?      → docs/{TOPIC}.md
```

---

## Plantilla Estándar

```markdown
# {Título del Documento}

Breve descripción de una línea sobre qué cubre este documento.

## Tabla de Contenidos

- [Resumen Ejecutivo](#resumen-ejecutivo)
- [Conceptos Clave](#conceptos-clave)
- [Implementación](#implementación)
- [Ejemplos](#ejemplos)
- [Recursos](#recursos)

## Resumen Ejecutivo

[2-3 párrafos máximo]

## Conceptos Clave

### {Concepto 1}
Explicación breve...

## Implementación

### Paso 1: {Acción}
\`\`\`typescript
// Código de ejemplo
\`\`\`

## Resources

### Skills Relacionados
- [{Skill}](../skills/{skill}/SKILL.md)

---

**Versión**: 1.0  
**Última actualización**: YYYY-MM-DD  
**Skill asociado**: [{skill}](../skills/{skill}/SKILL.md)
```

---

## Resources

- **Plantilla**: [assets/doc-template.md](assets/doc-template.md)
