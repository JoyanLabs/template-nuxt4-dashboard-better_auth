<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range } from '~/types'
import { authClient } from '~/lib/auth-client'

// La página está protegida por el middleware global de autenticación
definePageMeta({})

const { isNotificationsSlideoverOpen } = useDashboard()
// ✅ CORRECTO: Usar composable específico para SSR
const { user } = await useAuthSSR()

/**
 * Handler de cierre de sesión
 * Usa authClient directamente para evitar problemas con useAuth() en SSR
 */
const handleSignOut = async () => {
  try {
    // Llamar directamente a authClient en lugar de useAuth()
    await authClient.signOut()

    // Redirigir al login
    await navigateTo('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Incluso si hay error, intentar redirigir al login
    await navigateTo('/login')
  }
}

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}, {
  label: 'Cerrar sesión',
  icon: 'i-lucide-log-out',
  onSelect: handleSignOut // ✅ Correcto: onSelect en lugar de click
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- Mostrar usuario autenticado -->
          <div v-if="user" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-user-circle" class="size-5" />
            <span>{{ user.name || user.email }}</span>
          </div>

          <UTooltip text="Notifications" :shortcuts="['N']">
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

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
