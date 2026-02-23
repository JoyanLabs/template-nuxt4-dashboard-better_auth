<script setup lang="ts">
// Datos Mock Genéricos para Dashboard - Template

// 1. KPI: Ingresos Totales
const ingresosStats = {
  total: 45680,
  tendencia: 8,
  mesAnterior: 42280
}

// Historial de ingresos por mes (últimos 6 meses)
const historialIngresos = [
  { mes: 'Ene', cantidad: 38500 },
  { mes: 'Feb', cantidad: 41200 },
  { mes: 'Mar', cantidad: 39800 },
  { mes: 'Abr', cantidad: 43500 },
  { mes: 'May', cantidad: 42280 },
  { mes: 'Jun', cantidad: 45680 }
]

const ingresosCategories = {
  cantidad: { name: 'Ingresos', color: 'var(--ui-primary)' }
}

const xFormatterIngresos = (i: number): string => `${historialIngresos[i]?.mes ?? ''}`

// 2. Servicios Más Populares (BarChart - Top 5)
const serviciosData = [
  { servicio: 'Consultoría', nombre: 'Consultoría Técnica', cantidad: 45 },
  { servicio: 'Diseño', nombre: 'Diseño de Sistemas', cantidad: 38 },
  { servicio: 'Auditoría', nombre: 'Auditoría Ambiental', cantidad: 29 },
  { servicio: 'Capacitación', nombre: 'Capacitación', cantidad: 22 },
  { servicio: 'Mantenimiento', nombre: 'Mantenimiento', cantidad: 18 }
]

const serviciosCategories = {
  cantidad: { name: 'Servicios', color: 'var(--ui-secondary)' }
}

const xFormatterServicios = (i: number): string =>
  `${serviciosData[i]?.servicio ?? ''}`

// 3. Estados de Proyectos (DonutChart filled completo)
const estadosData = [
  {
    key: 'Pendiente',
    label: 'Pendiente',
    name: 'Proyectos Pendientes',
    color: '#3b82f6',
    value: 28
  },
  {
    key: 'Proceso',
    label: 'En Proceso',
    name: 'Proyectos en Proceso',
    color: '#06b6d4',
    value: 35
  },
  {
    key: 'Revisión',
    label: 'Revisión',
    name: 'En Revisión',
    color: '#8b5cf6',
    value: 18
  },
  {
    key: 'Completado',
    label: 'Completado',
    name: 'Proyectos Completados',
    color: '#10b981',
    value: 42
  },
  {
    key: 'Cancelado',
    label: 'Cancelado',
    name: 'Proyectos Cancelados',
    color: '#ef4444',
    value: 7
  }
]

const estadosValues = estadosData.map(i => i.value)
const totalEstados = estadosValues.reduce((a, b) => a + b, 0)

const estadosCategories: Record<string, { name: string, color: string }> = {
  'Pendiente': { name: 'Pendiente', color: '#3b82f6' },
  'Proceso': { name: 'En Proceso', color: '#06b6d4' },
  'Revisión': { name: 'Revisión', color: '#8b5cf6' },
  'Completado': { name: 'Completado', color: '#10b981' },
  'Cancelado': { name: 'Cancelado', color: '#ef4444' }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- FILA SUPERIOR: 2 gráficas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 1. KPI: Ingresos con Tendencia -->
      <UCard class="h-full">
        <template #header>
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <p class="text-xs text-muted font-medium uppercase tracking-wider">
                Métricas
              </p>
              <h3 class="text-lg font-bold text-highlighted">
                Ingresos Totales
              </h3>
            </div>
            <UButton
              icon="i-lucide-dollar-sign"
              size="sm"
              color="neutral"
              variant="ghost"
            />
          </div>
        </template>

        <!-- KPI Principal -->
        <div class="flex items-end justify-between mb-4">
          <div>
            <div class="text-4xl font-bold text-highlighted">
              {{ formatCurrency(ingresosStats.total) }}
            </div>
            <div class="text-sm text-muted mt-1">
              Total junio 2024
            </div>
          </div>
          <div
            class="flex items-center gap-1 text-sm px-3 py-1 rounded-full"
            :class="
              ingresosStats.tendencia >= 0
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            "
          >
            <UIcon
              :name="
                ingresosStats.tendencia >= 0
                  ? 'i-lucide-trending-up'
                  : 'i-lucide-trending-down'
              "
              class="size-4"
            />
            <span class="font-semibold">{{ ingresosStats.tendencia >= 0 ? '+' : '' }}{{ ingresosStats.tendencia }}%</span>
          </div>
        </div>

        <!-- Gráfico de Tendencia de Ingresos -->
        <div class="h-[140px] mb-4">
          <LineChart
            :data="historialIngresos"
            :categories="ingresosCategories"
            :y-axis="['cantidad']"
            :height="140"
            :hide-legend="true"
            :x-formatter="xFormatterIngresos"
            :x-num-ticks="6"
            :x-domain-line="false"
            :y-domain-line="false"
            :x-grid-line="false"
            :y-grid-line="true"
            :show-points="true"
          />
        </div>

        <!-- Tendencia Mensual -->
        <div class="mt-8 pt-8 border-t-2 border-gray-300 dark:border-gray-700">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted">Tendencia 6 meses:</span>
            <div class="flex items-center gap-2 flex-wrap justify-end">
              <span
                v-for="(item, index) in historialIngresos"
                :key="index"
                class="tabular-nums text-xs"
                :class="
                  index === 5 ? 'font-semibold text-primary' : 'text-muted'
                "
              >
                {{ item.mes }} {{ item.cantidad }}{{ index < 5 ? ',' : '' }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 2. Estados de Proyectos (DonutChart filled completo) -->
      <UCard class="h-full">
        <template #header>
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <p class="text-xs text-muted font-medium uppercase tracking-wider">
                Pipeline
              </p>
              <h3 class="text-lg font-bold text-highlighted">
                Estados de Proyectos
              </h3>
            </div>
            <UButton
              icon="i-lucide-pie-chart"
              size="sm"
              color="neutral"
              variant="ghost"
            />
          </div>
        </template>

        <div class="h-[220px] flex items-center justify-center">
          <DonutChart
            :data="estadosValues"
            :height="220"
            :categories="estadosCategories"
            :pad-angle="0"
            :arc-width="0"
            :hide-legend="true"
            :radius="4"
          />
        </div>

        <!-- Separador y Leyenda -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p class="text-xs text-muted uppercase tracking-wider mb-4">
            Distribución de Estados
          </p>
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div
              v-for="(estado, index) in estadosData"
              :key="index"
              class="flex items-center justify-between py-2"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full shrink-0"
                  :style="{ backgroundColor: estado.color }"
                />
                <span class="text-muted">{{ estado.label }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold tabular-nums">{{ estado.value }}</span>
                <span class="text-muted">({{ Math.round((estado.value / totalEstados) * 100) }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- FILA INFERIOR: Top 5 Servicios (ancho completo) -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <p class="text-xs text-muted font-medium uppercase tracking-wider">
              Servicios
            </p>
            <h3 class="text-lg font-bold text-highlighted">
              Top 5 Servicios Más Solicitados
            </h3>
          </div>
          <UButton
            icon="i-lucide-briefcase"
            size="sm"
            color="neutral"
            variant="ghost"
          />
        </div>
      </template>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Gráfico de Barras -->
        <div class="lg:col-span-4 h-[280px]">
          <BarChart
            :data="serviciosData"
            :categories="serviciosCategories"
            :y-axis="['cantidad']"
            :height="280"
            :hide-legend="true"
            :rounded="4"
            :bar-padding="0.5"
            :x-formatter="xFormatterServicios"
            :x-num-ticks="5"
            :x-domain-line="false"
            :y-domain-line="false"
            :x-grid-line="false"
            :y-grid-line="true"
          />
        </div>

        <!-- Leyenda de Servicios -->
        <div class="space-y-2">
          <div
            v-for="(servicio, index) in serviciosData"
            :key="index"
            class="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50"
          >
            <div class="min-w-0 flex-1">
              <div class="text-sm font-semibold text-highlighted">
                {{ servicio.servicio }}
              </div>
              <div class="text-xs text-muted truncate">
                {{ servicio.nombre }}
              </div>
            </div>
            <div class="text-lg font-bold text-primary ml-3">
              {{ servicio.cantidad }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
