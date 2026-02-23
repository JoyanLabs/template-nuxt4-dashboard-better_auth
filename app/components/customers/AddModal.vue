<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)

const schema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  empresa: z.string().optional(),
  telefono: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  empresa: undefined,
  telefono: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: 'Cliente creado',
    description: `${event.data.name} ha sido agregado correctamente`,
    color: 'success'
  })
  open.value = false
  Object.assign(state, {
    name: undefined,
    email: undefined,
    empresa: undefined,
    telefono: undefined
  })
}
</script>

<template>
  <UModal v-model:open="open" title="Nuevo Cliente" description="Agregar un nuevo cliente al sistema" size="lg">
    <UButton label="Nuevo Cliente" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Nombre" name="name" required>
            <UInput v-model="state.name" placeholder="Juan Pérez" class="w-full" />
          </UFormField>
          
          <UFormField label="Email" name="email" required>
            <UInput v-model="state.email" type="email" placeholder="juan@ejemplo.com" class="w-full" />
          </UFormField>
          
          <UFormField label="Empresa" name="empresa">
            <UInput v-model="state.empresa" placeholder="Nombre de empresa" class="w-full" />
          </UFormField>
          
          <UFormField label="Teléfono" name="telefono">
            <UInput v-model="state.telefono" placeholder="+51 999..." class="w-full" />
          </UFormField>
        </div>
        
        <div class="flex justify-end gap-2 pt-4 border-t border-default">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Crear Cliente"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
