<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range } from '~/types'
import { authClient } from '~/utils/auth-client'
import DashboardStats from '~/components/home/DashboardStats.client.vue'

definePageMeta({})

const { isNotificationsSlideoverOpen } = useDashboard()
const { user } = await useAuthSSR()

const handleSignOut = async () => {
  try {
    await authClient.signOut()
    await navigateTo('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    await navigateTo('/login')
  }
}

const items = [[{
  label: 'Nuevo cliente',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}, {
  label: 'Cerrar sesión',
  icon: 'i-lucide-log-out',
  onSelect: handleSignOut
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: new Date(new Date().setDate(new Date().getDate() - 14)),
  end: new Date()
})
const period = ref<Period>('daily')
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Inicio" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div v-if="user" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-user-circle" class="size-5" />
            <span>{{ user.name || user.email }}</span>
          </div>

          <UTooltip text="Notificaciones" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DashboardStats />
    </template>
  </UDashboardPanel>
</template>
