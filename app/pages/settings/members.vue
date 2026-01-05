<script setup lang="ts">
import type { Member } from '~/types'

// TODO: Implementar composable para obtener miembros del equipo
// Estructura de datos esperada:
// interface Member {
//   id: string | number
//   name: string
//   username: string
//   email: string
//   avatar?: { src: string; alt: string }
//   role: string
// }
//
// Ejemplo de implementación:
// const { members, loading, inviteMember, removeMember } = useTeamMembers()
//
// El composable debería incluir:
// - members: Lista reactiva de miembros
// - loading: Estado de carga
// - inviteMember: Función para invitar nuevos miembros
// - removeMember: Función para eliminar miembros
const members = ref<Member[]>([])

const q = ref('')

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return member.name.search(new RegExp(q.value, 'i')) !== -1 || member.username.search(new RegExp(q.value, 'i')) !== -1
  })
})
</script>

<template>
  <div>
    <UPageCard
      title="Members"
      description="Invite new members by email address."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Invite people"
        color="neutral"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search members"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </UPageCard>
  </div>
</template>
