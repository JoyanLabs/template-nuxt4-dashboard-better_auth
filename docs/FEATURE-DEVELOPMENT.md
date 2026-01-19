# Guía de Desarrollo de Features - Full Stack

Esta guía documenta el flujo completo para implementar una nueva funcionalidad desde el backend hasta componentes reutilizables en el frontend.

---

## 📋 Tabla de Contenidos

1. [Flujo General](#flujo-general)
2. [Paso 1: Backend - DTOs](#paso-1-backend---dtos)
3. [Paso 2: Backend - Controller](#paso-2-backend---controller)
4. [Paso 3: Frontend - Schemas de Validación](#paso-3-frontend---schemas-de-validación)
5. [Paso 4: Frontend - Composables](#paso-4-frontend---composables)
6. [Paso 5: Frontend - Componentes](#paso-5-frontend---componentes)
7. [Paso 6: Frontend - Integración en Páginas](#paso-6-frontend---integración-en-páginas)
8. [Patrones de Nuxt UI](#patrones-de-nuxt-ui)
9. [Checklist de Implementación](#checklist-de-implementación)

---

## Flujo General

```
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (NestJS)                         │
├─────────────────────────────────────────────────────────────────┤
│  1. DTOs (validación entrada) → 2. Controller (endpoints API)  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (Nuxt)                           │
├─────────────────────────────────────────────────────────────────┤
│  3. Schemas Zod → 4. Composables → 5. Componentes → 6. Páginas │
└─────────────────────────────────────────────────────────────────┘
```

---

## Paso 1: Backend - DTOs

**Ubicación:** `spp-backend/src/contexts/[recurso]/api/[recurso].dto.ts`

Los DTOs definen la estructura y validación de los datos de entrada.

### Estructura

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO para crear un nuevo recurso
 */
export class CreateResourceDto {
  @ApiProperty({ description: 'Nombre del recurso', example: 'Mi Recurso' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Descripción opcional' })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * DTO para actualizar un recurso existente
 */
export class UpdateResourceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}
```

### Convenciones

| Prefijo | Uso |
|---------|-----|
| `Create*Dto` | Para operaciones POST |
| `Update*Dto` | Para operaciones PATCH/PUT |
| `*QueryDto` | Para parámetros de consulta |
| `*ResponseDto` | Para respuestas tipadas |

---

## Paso 2: Backend - Controller

**Ubicación:** `spp-backend/src/contexts/[recurso]/api/[recurso].controller.ts`

### Estructura Base

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';

import { auth } from '@/shared/infrastructure/auth/better-auth.config.js';
import { handleBetterAuthError, toWebHeaders } from '@/shared/infrastructure/auth/better-auth.utils.js';
import { RequireRole } from '@/shared/infrastructure/decorators/roles.decorator.js';
import { RequirePermission } from '@/shared/infrastructure/decorators/permission.decorator.js';
import { RolesGuard } from '@/shared/infrastructure/guards/roles.guard.js';
import { PermissionsGuard } from '@/shared/infrastructure/guards/permissions.guard.js';

import { CreateResourceDto, UpdateResourceDto } from './resource.dto.js';

@ApiTags('resources')
@ApiBearerAuth()
@Controller('resources')
export class ResourceController {

  @Get()
  @UseGuards(RolesGuard)
  @RequireRole(['admin', 'moderator'])
  @ApiOperation({ summary: 'Listar recursos' })
  async list(@Req() req: Request) {
    try {
      const result = await auth.api.someMethod({
        headers: toWebHeaders(req.headers),
      });
      return result;
    } catch (error) {
      handleBetterAuthError(error);
    }
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermission({ resource: ['create'] })
  @ApiOperation({ summary: 'Crear recurso' })
  async create(@Req() req: Request, @Body() dto: CreateResourceDto) {
    try {
      const result = await auth.api.adminCreateResource({
        headers: toWebHeaders(req.headers),
        body: dto,
      });
      return result;
    } catch (error) {
      handleBetterAuthError(error);
    }
  }
}
```

### Guards Disponibles

| Guard | Decorator | Uso |
|-------|-----------|-----|
| `RolesGuard` | `@RequireRole(['admin'])` | Verificar rol exacto |
| `PermissionsGuard` | `@RequirePermission({ user: ['ban'] })` | Verificar permiso granular |

---

## Paso 3: Frontend - Schemas de Validación

**Ubicación:** `spp-frontend/app/utils/[recurso].schema.ts`

Los schemas de Zod validan los datos en el frontend antes de enviar al backend.

### Estructura

```typescript
import { z } from 'zod'

/**
 * Schema para crear recurso
 */
export const createResourceSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  description: z.string().optional(),
  email: z.string()
    .email('Introduce un email válido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export type CreateResourceForm = z.infer<typeof createResourceSchema>

/**
 * Schema para actualizar recurso
 */
export const updateResourceSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').optional(),
  description: z.string().optional(),
})

export type UpdateResourceForm = z.infer<typeof updateResourceSchema>
```

### Reglas Comunes

| Validador | Uso |
|-----------|-----|
| `.min(1, msg)` | Campo obligatorio |
| `.email(msg)` | Validar formato email |
| `.min(8, msg)` | Mínimo de caracteres |
| `.optional()` | Campo opcional |
| `.refine()` | Validación personalizada |

---

## Paso 4: Frontend - Composables

**Ubicación:** `spp-frontend/app/composables/use[Recurso]API.ts`

### Patrón Lectura + Mutaciones

```typescript
import type { CreateResourceForm, UpdateResourceForm } from '~/utils/resource.schema'

// ============================================
// TIPOS
// ============================================

interface ResourceResponse {
  id: string
  name: string
  description?: string
  createdAt: string
}

interface ResourceListResponse {
  resources: ResourceResponse[]
  total: number
}

// ============================================
// LECTURA CON CACHÉ (SSR-safe)
// ============================================

export function useResourceList() {
  const { checkPermission } = useRole()
  
  const canView = computed(() => checkPermission({ resource: ['list'] }))
  
  return useFetch<ResourceListResponse>('/api/resources', {
    key: 'resource-list',
    immediate: canView.value,
    watch: [canView],
    getCachedData(key) {
      if (!canView.value) return null
      const nuxtApp = useNuxtApp()
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })
}

// ============================================
// MUTACIONES (sin caché)
// ============================================

export function useResourceMutations() {
  const { isAdmin, checkPermission } = useRole()
  const nuxtApp = useNuxtApp()
  
  // Invalidar caché después de mutaciones
  const invalidateCache = () => {
    delete nuxtApp.payload.data['resource-list']
    refreshNuxtData('resource-list')
  }
  
  /**
   * Crear nuevo recurso
   * Requiere: rol admin
   */
  const createResource = async (data: CreateResourceForm) => {
    if (!isAdmin.value) {
      throw new Error('Requiere rol de administrador')
    }
    
    const result = await $fetch<ResourceResponse>('/api/resources', {
      method: 'POST',
      body: data
    })
    
    invalidateCache()
    return result
  }
  
  /**
   * Actualizar recurso existente
   * Requiere: permiso resource:update
   */
  const updateResource = async (id: string, data: UpdateResourceForm) => {
    if (!checkPermission({ resource: ['update'] })) {
      throw new Error('No tienes permiso para actualizar recursos')
    }
    
    const result = await $fetch<ResourceResponse>(`/api/resources/${id}`, {
      method: 'PATCH',
      body: data
    })
    
    invalidateCache()
    return result
  }
  
  /**
   * Eliminar recurso
   * Requiere: permiso resource:delete
   */
  const deleteResource = async (id: string) => {
    if (!checkPermission({ resource: ['delete'] })) {
      throw new Error('No tienes permiso para eliminar recursos')
    }
    
    await $fetch(`/api/resources/${id}`, {
      method: 'DELETE'
    })
    
    invalidateCache()
  }
  
  return {
    createResource,
    updateResource,
    deleteResource
  }
}
```

### Cuándo usar cada uno

| Composable | Uso | SSR |
|------------|-----|-----|
| `useResourceList()` | Leer datos con caché | ✅ |
| `useResourceMutations()` | Crear/Editar/Eliminar | ❌ |

---

## Paso 5: Frontend - Componentes

**Ubicación:** `spp-frontend/app/components/[seccion]/[recurso]/`

### Estructura de Carpetas

```
app/components/settings/
├── ResourceList.vue            # Lista principal
└── resources/
    ├── ResourceCreateModal.vue # Crear
    ├── ResourceEditModal.vue   # Editar
    └── ResourceDeleteModal.vue # Eliminar (confirmación)
```

### Patrón de Modal con Formulario

```vue
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { createResourceSchema, type CreateResourceForm } from '~/utils/resource.schema'

// Props y Emits estándar para modales
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': []
}>()

// v-model bidireccional
const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

// Composables
const { createResource } = useResourceMutations()
const toast = useToast()

// Estado del formulario
const state = reactive<CreateResourceForm>({
  name: '',
  description: ''
})

const isSubmitting = ref(false)
const formRef = ref()

// Reset al cerrar
const resetForm = () => {
  state.name = ''
  state.description = ''
}

// Submit handler
const onSubmit = async (event: FormSubmitEvent<CreateResourceForm>) => {
  try {
    isSubmitting.value = true
    await createResource(event.data)
    
    toast.add({
      title: 'Recurso creado',
      description: `${event.data.name} ha sido creado correctamente.`,
      color: 'success'
    })
    
    resetForm()
    isOpen.value = false
    emit('success')
  } catch (error: unknown) {
    const err = error as { data?: { message?: string }, message?: string }
    toast.add({
      title: 'Error',
      description: err.data?.message || err.message || 'No se pudo crear',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Trigger submit desde footer
const handleSubmit = () => {
  formRef.value?.submit()
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Crear Recurso"
    description="Completa los datos del nuevo recurso."
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="createResourceSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Nombre" name="name" required>
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="Descripción" name="description">
          <UTextarea v-model="state.description" class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="ghost"
          @click="isOpen = false"
        />
        <UButton
          label="Crear"
          color="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
```

### Patrón de Modal de Confirmación (sin formulario)

```vue
<script setup lang="ts">
import type { Resource } from '~/types'

const props = defineProps<{
  open: boolean
  resource: Resource | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': []
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

const { deleteResource } = useResourceMutations()
const toast = useToast()
const isSubmitting = ref(false)

const handleConfirm = async () => {
  if (!props.resource) return

  try {
    isSubmitting.value = true
    await deleteResource(props.resource.id)
    
    toast.add({
      title: 'Recurso eliminado',
      color: 'success'
    })
    
    isOpen.value = false
    emit('success')
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'No se pudo eliminar',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Eliminar Recurso"
    description="¿Estás seguro de eliminar este recurso?"
  >
    <template #body>
      <UAlert
        icon="i-lucide-circle-alert"
        color="error"
        variant="soft"
        title="Acción irreversible"
        description="Esta acción no se puede deshacer."
      />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="ghost"
          @click="isOpen = false"
        />
        <UButton
          label="Eliminar"
          color="error"
          :loading="isSubmitting"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
```

---

## Paso 6: Frontend - Integración en Páginas

**Ubicación:** `spp-frontend/app/pages/[seccion]/[recurso].vue`

### Estructura de Página

```vue
<script setup lang="ts">
import type { Resource } from '~/types'

// Protección de ruta
definePageMeta({
  middleware: 'resource-management' // o 'admin'
})

// Permisos
const { isAdmin } = useRole()

// Datos
const { data, status, error, refresh } = useResourceList()

// Transformar datos si es necesario
const resources = computed<Resource[]>(() => {
  return data.value?.resources || []
})

// Búsqueda
const searchQuery = ref('')

const filteredResources = computed(() => {
  if (!searchQuery.value) return resources.value
  const term = searchQuery.value.toLowerCase()
  return resources.value.filter(r => 
    r.name.toLowerCase().includes(term)
  )
})

// Modal de crear
const isCreateModalOpen = ref(false)
</script>

<template>
  <div>
    <!-- Modal separado del contenido -->
    <SettingsResourcesResourceCreateModal
      v-model:open="isCreateModalOpen"
      @success="refresh"
    />

    <!-- Header -->
    <UPageCard
      title="Recursos"
      description="Gestiona los recursos del sistema."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Crear recurso"
        color="primary"
        icon="i-lucide-plus"
        :disabled="!isAdmin"
        @click="isCreateModalOpen = true"
      />
    </UPageCard>

    <!-- Error -->
    <UAlert
      v-if="error"
      icon="i-lucide-circle-alert"
      color="error"
      variant="soft"
      :title="error.message"
      class="mb-4"
    />

    <!-- Lista -->
    <UPageCard variant="subtle">
      <template #header>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Buscar..."
          class="w-full"
        />
      </template>

      <!-- Loading -->
      <div v-if="status === 'pending'" class="p-4">
        <USkeleton v-for="i in 3" :key="i" class="h-16 mb-2" />
      </div>

      <!-- Contenido -->
      <SettingsResourcesList
        v-else
        :resources="filteredResources"
        @refresh="refresh"
      />
    </UPageCard>
  </div>
</template>
```

---

## Patrones de Nuxt UI

### UModal - Estructura Correcta

```vue
<UModal v-model:open="isOpen" title="Título" description="Descripción">
  <!-- #body: Contenido principal -->
  <template #body>
    <div class="space-y-4">
      <!-- Contenido aquí -->
    </div>
  </template>

  <!-- #footer: Acciones -->
  <template #footer>
    <div class="flex justify-end gap-2">
      <UButton label="Cancelar" color="neutral" variant="ghost" />
      <UButton label="Confirmar" color="primary" />
    </div>
  </template>
</UModal>
```

### UForm - Con Submit Externo

Cuando el botón de submit está fuera del formulario (en el `#footer` del modal):

```vue
<script setup>
const formRef = ref()

const handleSubmit = () => {
  formRef.value?.submit()
}
</script>

<template>
  <UForm ref="formRef" :schema="schema" :state="state" @submit="onSubmit">
    <!-- campos -->
  </UForm>
  
  <UButton @click="handleSubmit">Enviar</UButton>
</template>
```

### USelect - Con Keys Explícitos

```vue
<USelect
  v-model="state.role"
  :items="roles"
  value-key="value"
  label-key="label"
/>
```

### UFormField - Validación Automática

```vue
<!-- El 'name' debe coincidir con el campo del schema -->
<UFormField label="Email" name="email" required>
  <UInput v-model="state.email" type="email" />
</UFormField>
```

---

## Checklist de Implementación

### Backend

- [ ] Crear DTOs con validaciones de `class-validator`
- [ ] Decorar con `@ApiProperty` para Swagger
- [ ] Crear endpoints en Controller con guards apropiados
- [ ] Usar `toWebHeaders()` y `handleBetterAuthError()`

### Frontend - Datos

- [ ] Crear schema Zod en `utils/[recurso].schema.ts`
- [ ] Exportar tipos con `z.infer<>`
- [ ] Crear composable de lectura (`useFetch` + caché)
- [ ] Crear composable de mutaciones (`$fetch` + invalidación)
- [ ] Verificar permisos antes de cada operación

### Frontend - UI

- [ ] Crear componentes de modal en carpeta dedicada
- [ ] Usar `v-model:open` para control del modal
- [ ] Emit `success` para refrescar datos en padre
- [ ] Usar `formRef` cuando botón está en `#footer`
- [ ] Manejar estados de loading con `isSubmitting`
- [ ] Mostrar errores con `useToast()`

### Frontend - Integración

- [ ] Proteger página con middleware
- [ ] Usar composable de lectura para datos
- [ ] Implementar búsqueda/filtrado local
- [ ] Colocar modales fuera del contenido principal
- [ ] Llamar `refresh()` después de mutaciones exitosas

---

## Ejemplo Completo: Gestión de Usuarios

El módulo de usuarios implementa todos estos patrones:

| Archivo | Propósito |
|---------|-----------|
| `spp-backend/.../user.dto.ts` | DTOs de validación |
| `spp-backend/.../user.controller.ts` | Endpoints REST |
| `spp-frontend/.../user.schema.ts` | Schemas Zod |
| `spp-frontend/.../useUsersAPI.ts` | Composables |
| `spp-frontend/.../UserCreateModal.vue` | Modal crear |
| `spp-frontend/.../UserEditModal.vue` | Modal editar |
| `spp-frontend/.../UserDeleteModal.vue` | Modal eliminar |
| `spp-frontend/.../UserBanModal.vue` | Modal banear |
| `spp-frontend/.../UserPasswordModal.vue` | Modal contraseña |
| `spp-frontend/.../UsersList.vue` | Lista coordinadora |
| `spp-frontend/.../users.vue` | Página principal |

Usa estos archivos como referencia al crear nuevas funcionalidades.
