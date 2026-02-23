<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableColumn } from '@nuxt/ui'

// --- Interfaces para definir las props y eventos ---
export interface DataTableFilter {
  key: string
  label: string
  options: { value: string | number, label: string }[]
}

interface DataTableProps<T> {
  // Datos principales
  data?: T[]
  columns: TableColumn<T>[]
  loading?: boolean

  // Paginación y Metadata
  total?: number
  page?: number
  pageSize?: number
  pageSizeOptions?: number[]

  // Filtros y Búsqueda
  search?: string
  searchPlaceholder?: string

  // Título y Acciones
  title?: string
  description?: string

  // Click en filas
  clickable?: boolean
}

// Valores por defecto
const props = withDefaults(defineProps<DataTableProps<T>>(), {
  data: () => [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 10,
  pageSizeOptions: () => [5, 10, 20, 50],
  search: '',
  searchPlaceholder: 'Buscar...',
  title: 'Tabla de Datos'
})

const emit = defineEmits<{
  (e: 'update:page' | 'update:pageSize', value: number): void
  (e: 'update:search', value: string): void
  (e: 'create'): void
  (e: 'row-click', row: T): void
}>()

// --- Computed ---
// Manejo local de v-models para simplificar la vista padre
const currentPage = computed({
  get: () => props.page,
  set: val => emit('update:page', val)
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: val => emit('update:pageSize', Number(val))
})

const currentSearch = computed({
  get: () => props.search,
  set: val => emit('update:search', val)
})

// Referencias
const tableContainer = ref<HTMLElement | null>(null)

// Handler para click en fila usando event delegation
const handleTableClick = (event: MouseEvent) => {
  if (!props.clickable || !tableContainer.value) return

  // Verificar que el click NO sea en elementos interactivos (botones, menús, dropdowns, etc.)
  const target = event.target as HTMLElement
  const interactiveElement = target.closest('button, a, [role="button"], .dropdown-menu, [data-ignore-row-click]')

  if (interactiveElement) {
    // Es un click en un botón o elemento interactivo, NO emitir row-click
    return
  }

  // Buscar la fila (tr) más cercana al elemento clickeado
  const row = target.closest('tr')

  // Asegurarse de que el click fue en el cuerpo de la tabla (tbody), no en el header (thead)
  if (row && row.parentElement?.tagName === 'TBODY' && tableContainer.value.contains(row)) {
    // Encontrar el índice de la fila dentro del tbody
    const rows = Array.from(row.parentElement.querySelectorAll('tr'))
    const index = rows.indexOf(row)

    if (index >= 0 && index < props.data.length) {
      const rowData = props.data[index]
      emit('row-click', rowData as T)
    }
  }
}
</script>

<template>
  <UCard class="w-full">
    <!-- Header: Título, Buscador y Acciones -->
    <template #header>
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <!-- Título y Descripción -->
        <div>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ description }}
          </p>
        </div>

        <!-- Acciones: Search + Create Button -->
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <UInput
            v-model="currentSearch"
            icon="i-lucide-search"
            :placeholder="searchPlaceholder"
            class="flex-1 sm:w-64"
            size="sm"
          />

          <slot name="actions">
            <UButton
              label="Crear"
              icon="i-lucide-plus"
              size="sm"
              color="primary"
              @click="emit('create')"
            />
          </slot>
        </div>
      </div>

      <!-- Slot para filtros adicionales debajo del header -->
      <div v-if="$slots.filters" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <slot name="filters" />
      </div>
    </template>

    <!-- Tabla con click handler global usando delegation -->
    <div
      ref="tableContainer"
      :class="['w-full relative', clickable ? 'cursor-pointer' : '']"
      @click="handleTableClick"
    >
      <UTable
        :data="data"
        :columns="columns"
        :loading="loading"
        class="w-full"
      >
        <!-- Forwarding de slots de celdas personalizados -->
        <template v-for="(slotFn, slotName) in $slots" :key="slotName" #[slotName]="slotData">
          <slot :name="slotName" v-bind="slotData" />
        </template>
      </UTable>
    </div>

    <!-- Footer: Paginación -->
    <template #footer>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Selector de Rows per Page -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>Mostrar</span>
          <USelect
            v-model="currentPageSize"
            :items="pageSizeOptions"
            size="xs"
            class="w-20"
          />
          <span>por página</span>
        </div>

        <!-- Paginador -->
        <UPagination
          v-model:page="currentPage"
          :total="total"
          :items-per-page="pageSize"
          :max="5"
          size="sm"
          show-last
          show-first
        />
      </div>
    </template>
  </UCard>
</template>
