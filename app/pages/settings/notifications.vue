<script setup lang="ts">
const state = reactive<{ [key: string]: boolean }>({
  example_notification: true,
  security_alerts: true
})

const sections = [{
  title: 'Preferencias de ejemplo',
  description: 'Configuración de ejemplo para la aplicación',
  fields: [{
    name: 'example_notification',
    label: 'Notificación de ejemplo',
    description: 'Recibir notificaciones de ejemplo.'
  }]
}, {
  title: 'Seguridad',
  description: 'Configuración de seguridad de la cuenta',
  fields: [{
    name: 'security_alerts',
    label: 'Alertas de seguridad',
    description: 'Recibir alertas sobre actividad sospechosa en tu cuenta.'
  }]
}]

// TODO: Implementar composable para gestión de notificaciones
// Estructura de datos:
// interface NotificationSettings {
//   [key: string]: boolean
// }
//
// Ejemplo de implementación:
// const { settings, updateSettings, loading } = useNotificationSettings()
//
// El composable debería:
// - Cargar las preferencias actuales del usuario
// - Guardar cambios en el backend
// - Manejar estados de carga y error
// - Usar debounce para evitar múltiples llamadas

async function onChange() {
  // Do something with data
  console.log(state)
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      :title="section.title"
      :description="section.description"
      variant="naked"
      class="mb-4"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch
          v-model="state[field.name]"
          @update:model-value="onChange"
        />
      </UFormField>
    </UPageCard>
  </div>
</template>
