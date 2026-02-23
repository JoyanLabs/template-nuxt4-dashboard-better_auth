<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { checkPermission } = useRole()

/**
 * Links de navegación filtrados por permisos
 */
const links = computed(() => {
  const items: NavigationMenuItem[] = []

  // Usuarios - solo visible si tiene permiso user:list
  if (checkPermission({ user: ['list'] })) {
    items.push({
      label: 'Usuarios',
      icon: 'i-lucide-users',
      to: '/settings/users'
    })
  }

  items.push({
    label: 'Notificaciones',
    icon: 'i-lucide-bell',
    to: '/settings/notifications'
  }, {
    label: 'Seguridad',
    icon: 'i-lucide-shield',
    to: '/settings/security'
  })

  return [[...items]]
})
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Configuración">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
