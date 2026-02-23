---
name: skill-auditor
description: >
  Audita y revisa skills existentes para verificar calidad y consistencia.
  Trigger: Cuando se necesita validar skills contra código real o verificar documentación de skills.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Auditar o revisar skills existentes|Validar skills contra código real|Verificar documentación de skills"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## When to Use

Usa esta skill cuando:
- Necesitas validar que un skill refleja correctamente el código real
- Quieres verificar la calidad de la documentación de skills
- Detectas inconsistencias entre skills y código
- Creas un nuevo skill y quieres asegurar calidad

---

## Checklist de Auditoría

### Estructura del Skill

- [ ] Archivo `SKILL.md` existe en `skills/{name}/`
- [ ] Frontmatter completo con name, description, metadata
- [ ] `auto_invoke` definido y específico
- [ ] `allowed-tools` configurado

### Contenido

- [ ] Sección "When to Use" clara
- [ ] "When NOT to use" definido (si aplica)
- [ ] Ejemplos de código funcionales
- [ ] Decision tree (si aplica)
- [ ] Commands útiles listados
- [ ] Resources/Links actualizados

### Consistencia con Código

- [ ] Patrones documentados coinciden con código real
- [ ] Rutas de archivos son correctas
- [ ] APIs y funciones existen en el código
- [ ] No hay información obsoleta

---

## Comandos de Auditoría

```bash
# Verificar skills sin metadata
find skills/ -name "SKILL.md" -exec grep -L "auto_invoke" {} \;

# Buscar skills con fechas antiguas
grep -r "version:" skills/*/SKILL.md

# Verificar que todos los skills tienen assets/ o references/
for dir in skills/*/; do
  if [ ! -d "$dir/assets" ] && [ ! -d "$dir/references" ]; then
    echo "$dir - No tiene assets ni references"
  fi
done
```

---

## Proceso de Auditoría

```
1. Seleccionar skill a auditar
   └─ Leer SKILL.md completamente

2. Verificar código real
   └─ Comparar patrones con implementación actual

3. Identificar inconsistencias
   └─ Listar diferencias encontradas

4. Crear plan de corrección
   └─ Priorizar actualizaciones necesarias

5. Actualizar skill
   └─ Editar SKILL.md con correcciones

6. Verificar
   └─ Re-leer skill actualizado
```

---

## Ejemplo de Reporte

```
Auditoría: better-auth
======================

✅ Estructura correcta
✅ Frontmatter completo
⚠️  Ejemplo de código desactualizado (usa authClient viejo)
❌ Falta documentar función resetPassword

Acciones recomendadas:
1. Actualizar ejemplo de signIn (línea 45)
2. Agregar sección "Password Reset"
3. Verificar que todas las funciones de useAuth estén documentadas
```

---

## Resources

- **Skill Creator**: Ver `skills/skill-creator/SKILL.md`
- **Skill Sync**: Ver `skills/skill-sync/SKILL.md`
