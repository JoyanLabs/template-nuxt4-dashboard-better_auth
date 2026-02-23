# Nuxt Charts - Visualización de Datos

Guía para implementar gráficos con Nuxt Charts (basado en visx).

---

## Instalación

```bash
pnpm add nuxt-charts
```

## Configuración

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'nuxt-charts'
  ]
})
```

Los componentes se auto-importan, no requieren import manual.

---

## Componentes Disponibles

### LineChart

Ideal para tendencias temporales.

```vue
<template>
  <LineChart
    :data="chartData"
    :height="200"
    :categories="categories"
    curve-type="monotoneX"
  />
</template>

<script setup>
const chartData = [
  { month: 'Ene', sales: 45 },
  { month: 'Feb', sales: 52 },
  { month: 'Mar', sales: 38 }
]

const categories = {
  sales: { name: 'Ventas', color: 'var(--ui-primary)' }
}
</script>
```

**Props principales:**
- `:data` - Array de objetos
- `:categories` - Configuración de colores
- `:curve-type` - `'monotoneX'` | `'linear'`
- `:show-points` - Mostrar puntos

### BarChart

Para comparar cantidades entre categorías.

```vue
<template>
  <BarChart
    :data="chartData"
    :height="200"
    :categories="categories"
    :bar-padding="0.4"
  />
</template>
```

### DonutChart

Distribución proporcional de datos.

```vue
<template>
  <!-- Anillo -->
  <DonutChart
    :data="[23, 19, 39, 28]"
    :height="200"
    :categories="categories"
    :arc-width="20"
  />

  <!-- Círculo completo (filled) -->
  <DonutChart
    :data="[23, 19, 39, 28]"
    :height="220"
    :categories="categories"
    :arc-width="0"
    :pad-angle="0"
    type="full"
  />
</template>
```

**Props principales:**
- `:data` - Array de números
- `:arc-width` - Grosor del anillo (0 = filled)
- `:pad-angle` - Espacio entre segmentos
- `:type` - `'full'` | `'half'`

---

## Patrones de Uso

### Datos con Categorías

```typescript
// Siempre usar categories con keys que coincidan
const categories = {
  value: { name: 'Valor', color: 'var(--ui-primary)' }
}
```

### Colores del Tema

Usar variables CSS de Nuxt UI:
- `var(--ui-primary)`
- `var(--ui-secondary)`
- `var(--ui-success)`
- `var(--ui-error)`

---

## Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Gráfico no aparece | Sin altura definida | Agregar `:height` |
| Colores no aplican | Categories mal formado | Verificar keys |
| TypeError | Data no es array | Asegurar array de objetos/números |

---

## Recursos

- **Documentación**: https://nuxt-charts.com/docs
- **Nuxt UI Charts**: https://ui.nuxt.com/components/chart
