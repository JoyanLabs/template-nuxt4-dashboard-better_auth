---
name: table-patterns
description: >
  Patrones para implementar tablas interactivas con Nuxt UI v3.
  UiDataTable: componente reutilizable con soporte para click en filas,
  paginación, filtros y menús de acciones.
  Trigger: Cuando implementas tablas con click en filas, paginación,
  o necesitas manejar clicks en filas sin interferir con botones/menús.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Implementar tablas con click en filas, paginación, o UiDataTable"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usa esta skill cuando:
- Necesitas una tabla con **click en filas** para navegar al detalle
- Quieres **paginación, búsqueda y filtros** integrados
- Tienes un **menú de acciones** que no debe disparar el click de fila

---

## UiDataTable Component

### API Completa

```typescript
interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  clickable?: boolean
}

interface DataTableEmits {
  'row-click': (row: T) => void
}
```

### Uso Básico

```vue
<script setup lang="ts">
const columns = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' }
]

const { data } = await useFetch('/api/users')

const handleRowClick = (row) => {
  navigateTo(`/users/${row.id}`)
}
</script>

<template>
  <UiDataTable
    :data="data"
    :columns="columns"
    clickable
    @row-click="handleRowClick"
  />
</template>
```

### Uso con Slots Personalizados

```vue
<UiDataTable :data="users" :columns="columns" clickable @row-click="handleRowClick">
  <template #name-cell="{ row }">
    <div class="flex items-center gap-2">
      <UAvatar :alt="row.original.name" />
      <span>{{ row.original.name }}</span>
    </div>
  </template>

  <template #status-cell="{ row }">
    <UBadge :color="row.original.status === 'active' ? 'success' : 'neutral'">
      {{ row.original.status }}
    </UBadge>
  </template>

  <template #actions-cell="{ row }">
    <UDropdownMenu :items="[
      { label: 'Editar', onSelect: () => edit(row.original) },
      { label: 'Eliminar', color: 'error', onSelect: () => remove(row.original) }
    ]">
      <UButton icon="i-lucide-ellipsis-vertical" />
    </UDropdownMenu>
  </template>
</UiDataTable>
```

---

## Patrón Crítico: Click en Filas sin Interferir con Botones

```typescript
const handleTableClick = (event: MouseEvent) => {
  if (!props.clickable) return
  
  const target = event.target as HTMLElement
  
  // Detectar elementos interactivos
  const interactiveElement = target.closest(
    'button, a, [role="button"], .dropdown-menu'
  )
  
  if (interactiveElement) {
    return // Es un botón/menú → NO emitir row-click
  }
  
  // Emitir row-click
  const row = target.closest('tr')
  if (row) {
    const index = Array.from(row.parentElement?.querySelectorAll('tr') || [])
      .indexOf(row)
    if (index >= 0 && index < props.data.length) {
      emit('row-click', props.data[index])
    }
  }
}
```

---

## Checklist de Implementación

- [ ] Definir array `columns` con `accessorKey` y `header`
- [ ] Agregar columna `{ id: 'actions', header: '' }` para menú
- [ ] Crear slots `#{accessorKey}-cell` para celdas personalizadas
- [ ] Implementar `handleTableClick` con detección de botones
- [ ] Verificar que el menú de 3 puntos funciona sin disparar row-click
