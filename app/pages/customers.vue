<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

// Datos mockeados para clientes
interface Cliente {
  id: string
  name: string
  email: string
  empresa: string
  telefono: string
  estado: 'activo' | 'inactivo' | 'prospecto'
  fechaRegistro: string
}

const clientesData: Cliente[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@empresa.com', empresa: 'Empresa ABC', telefono: '+51 999 111 111', estado: 'activo', fechaRegistro: '2024-01-15' },
  { id: '2', name: 'María García', email: 'maria@empresa.com', empresa: 'Corporación XYZ', telefono: '+51 999 222 222', estado: 'activo', fechaRegistro: '2024-02-20' },
  { id: '3', name: 'Carlos López', email: 'carlos@empresa.com', empresa: 'Industrias 123', telefono: '+51 999 333 333', estado: 'prospecto', fechaRegistro: '2024-03-10' },
  { id: '4', name: 'Ana Martínez', email: 'ana@empresa.com', empresa: 'Servicios Perú', telefono: '+51 999 444 444', estado: 'inactivo', fechaRegistro: '2024-01-25' },
  { id: '5', name: 'Luis Rodríguez', email: 'luis@empresa.com', empresa: 'Constructora AAA', telefono: '+51 999 555 555', estado: 'activo', fechaRegistro: '2024-04-05' },
  { id: '6', name: 'Carmen Torres', email: 'carmen@empresa.com', empresa: 'Consultores Ltd', telefono: '+51 999 666 666', estado: 'activo', fechaRegistro: '2024-02-28' },
  { id: '7', name: 'Pedro Sánchez', email: 'pedro@empresa.com', empresa: 'Tech Solutions', telefono: '+51 999 777 777', estado: 'prospecto', fechaRegistro: '2024-05-12' },
  { id: '8', name: 'Laura Díaz', email: 'laura@empresa.com', empresa: 'Marketing Pro', telefono: '+51 999 888 888', estado: 'activo', fechaRegistro: '2024-03-22' }
]

const clientes = ref<Cliente[]>(clientesData)
const search = ref('')
const page = ref(1)
const pageSize = ref(10)

const filteredClientes = computed(() => {
  if (!search.value) return clientes.value
  const query = search.value.toLowerCase()
  return clientes.value.filter(c =>
    c.name.toLowerCase().includes(query)
    || c.email.toLowerCase().includes(query)
    || c.empresa.toLowerCase().includes(query)
  )
})

const total = computed(() => filteredClientes.value.length)

const columns: TableColumn<Cliente>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.original.name)
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'empresa',
    header: 'Empresa'
  },
  {
    accessorKey: 'telefono',
    header: 'Teléfono'
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const colors = {
        activo: 'success' as const,
        inactivo: 'error' as const,
        prospecto: 'warning' as const
      }
      const labels = {
        activo: 'Activo',
        inactivo: 'Inactivo',
        prospecto: 'Prospecto'
      }
      return h(UBadge, { color: colors[row.original.estado], variant: 'subtle' }, () => labels[row.original.estado])
    }
  },
  {
    accessorKey: 'fechaRegistro',
    header: 'Fecha Registro'
  }
]

const toast = useToast()

function handleCreate() {
  toast.add({
    title: 'Crear cliente',
    description: 'Funcionalidad en desarrollo',
    color: 'info'
  })
}

function handleRowClick(row: Cliente) {
  toast.add({
    title: row.name,
    description: `${row.empresa} - ${row.email}`,
    color: 'info'
  })
}
</script>

<template>
  <UDashboardPanel id="customers">
    <template #header>
      <UDashboardNavbar title="Clientes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <CustomersAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UiDataTable
        v-model:search="search"
        v-model:page="page"
        v-model:page-size="pageSize"
        :data="filteredClientes"
        :columns="columns"
        :total="total"
        title="Clientes"
        description="Gestión de clientes del sistema"
        search-placeholder="Buscar clientes..."
        clickable
        @create="handleCreate"
        @row-click="handleRowClick"
      />
    </template>
  </UDashboardPanel>
</template>
