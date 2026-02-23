---
name: dashboard-patterns
description: >
  Patrones para implementar dashboards con Nuxt 4: tabs de navegación,
  listados con detalle, y edición inline.
  Trigger: Cuando implementas dashboards con tabs, CRUD de listado a detalle,
  o vistas con edición inline.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Implementar dashboards con tabs, listado-detalle, o edición inline"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usa esta skill cuando:
- Implementas un **dashboard con tabs** (Admin, CRM, etc.)
- Necesitas navegación **listado → detalle** (click en fila abre detalle)
- Quieres **edición inline** en la vista de detalle

---

## Patrón 1: Dashboard con Tabs

### Estructura de Archivos

```
pages/dashboard/
├── dashboard.vue              # Layout padre con tabs
├── index.vue                  # Redirect a /dashboard/items
└── items/
    ├── index.vue              # Lista
    └── [id].vue               # Detalle
```

### Layout Padre

```vue
<script setup lang="ts">
const route = useRoute()

const tabs = [
  { label: 'Items', to: '/dashboard/items', icon: 'i-lucide-list' },
  { label: 'Settings', to: '/dashboard/settings', icon: 'i-lucide-settings' }
]

const activeTab = computed(() => 
  tabs.find(tab => route.path.startsWith(tab.to))?.label
)
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>
    <template #body>
      <UHorizontalNavigation :links="tabs" :active="activeTab" />
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>
```

### Página Listado

```vue
<script setup>
const { data: items } = await useFetch('/api/items')

const handleRowClick = (row) => {
  navigateTo(`/dashboard/items/${row.id}`)
}
</script>

<template>
  <div>
    <UiDataTable :data="items" :columns="columns" clickable @row-click="handleRowClick" />
  </div>
</template>
```

---

## Patrón 2: Edición Inline

```vue
<script setup>
const isEditing = ref(false)
const formState = reactive({ name: '', email: '' })

const handleSave = async () => {
  await $fetch(`/api/items/${id}`, { method: 'PUT', body: formState })
  isEditing.value = false
  refreshNuxtData(`item-${id}`)
}

const handleCancel = () => {
  isEditing.value = false
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3>Información</h3>
        <div v-if="!isEditing">
          <UButton @click="isEditing = true">Editar</UButton>
        </div>
        <div v-else>
          <UButton @click="handleCancel" variant="ghost">Cancelar</UButton>
          <UButton @click="handleSave" color="primary">Guardar</UButton>
        </div>
      </div>
    </template>

    <div v-if="!isEditing" class="space-y-4">
      <p>{{ item.name }}</p>
    </div>

    <UForm v-else :state="formState" @submit="handleSave">
      <UFormField label="Nombre">
        <UInput v-model="formState.name" />
      </UFormField>
    </UForm>
  </UCard>
</template>
```

---

## Checklist de Implementación

### Dashboard con Tabs
- [ ] Crear archivo `pages/{module}.vue` como layout
- [ ] Definir array `tabs` con `{ label, to, icon }`
- [ ] Usar `UHorizontalNavigation` para tabs
- [ ] Agregar `<NuxtPage />` para renderizar hijos

### Listado → Detalle
- [ ] Usar `UiDataTable` con prop `clickable`
- [ ] Implementar `@row-click="handleRowClick"`
- [ ] En handleRowClick: `navigateTo(`/{module}/${row.id}`)`
