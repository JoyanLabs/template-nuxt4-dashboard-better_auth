# Ejemplos de Uso: Git Guidelines

## Escenario 1: Crear un commit

**Usuario:** "quiero hacer un commit"

**AI:**
```bash
# 1. Analizar cambios staged
$ git diff --cached --stat
  app/components/NewComponent.vue | 45 +++++++++++

# 2. Sugerir mensaje
Sugerencia de commit:
  feat(components): add NewComponent

# 3. Ejecutar commit
$ git commit -m "feat(components): add NewComponent"
```

## Escenario 2: Crear un PR

**Usuario:** "crea el PR"

**AI:**
```bash
# 1. Analizar cambios
$ git log main..HEAD --oneline
abc1234 feat(components): add NewComponent

# 2. Verificar si existe PR
$ gh pr view 2>/dev/null || echo "No existe PR"

# 3. SOLICITAR CONFIRMACIÓN
⚠️ Se creará el PR. ¿Ejecutar? (sí/no)
```

## Escenario 3: Push con confirmación

```bash
# 1. Verificar rama
$ git branch --show-current
feat/new-feature

# 2. SOLICITAR CONFIRMACIÓN
⚠️ Se ejecutará: git push -u origin feat/new-feature
   ¿Ejecutar? (sí/no)
```
