<script setup lang="ts">
// Página de configuración general - Perfil deshabilitado temporalmente
// Redirigir a la primera sección disponible

const { checkPermission } = useRole()

// Determinar a dónde redirigir
onMounted(() => {
  if (checkPermission({ user: ['list'] })) {
    navigateTo('/settings/users')
  } else {
    navigateTo('/settings/security')
  }
})
</script>

<template>
  <div class="flex items-center justify-center py-12">
    <p class="text-muted">
      Redirigiendo...
    </p>
  </div>
</template>
