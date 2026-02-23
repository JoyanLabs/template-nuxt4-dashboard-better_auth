---
name: nuxt-charts
description: >
  Integración de Nuxt Charts (visx) para visualizaciones de datos.
  Trigger: Cuando se implementan gráficos con BarChart, LineChart, DonutChart, etc.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Implementar gráficos con nuxt-charts"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usar este skill cuando:
- Se necesita agregar visualizaciones de datos al dashboard
- Se implementa un nuevo reporte con gráficos
- Se modifica un componente existente con gráficos

---

## Critical Patterns

### 1. Estructura de Datos

```typescript
// LineChart / BarChart
const chartData = [
  { mes: 'Ene', valor: 45 },
  { mes: 'Feb', valor: 52 },
]

// DonutChart
const donutData = [23, 19, 39, 28, 31, 16]
```

### 2. Categories

SIEMPRE usar categories con keys que coincidan:

```typescript
const categories = {
  cantidad: { name: 'Cotizaciones', color: 'var(--ui-primary)' }
}
```

### 3. DonutChart Filled

```vue
<DonutChart
  :data="values"
  :height="220"
  :categories="categories"
  :arc-width="0"
  :pad-angle="0"
  :type="'full'"
  :radius="4"
  :hide-legend="true"
/>
```

---

## Componentes Disponibles

| Componente | Uso | Props Clave |
|------------|-----|--------------|
| `LineChart` | Tendencias temporales | `:data`, `:categories`, `:curve-type` |
| `BarChart` | Comparaciones | `:data`, `:categories` |
| `DonutChart` | Distribución proporcional | `:data`, `:arc-width`, `:type` |

---

## Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Gráfico no aparece | Height no definido | Incluir `:height` |
| Colores no aplican | Categories mal formado | Verificar keys |

---

## Resources

- **Documentation**: https://nuxt-charts.com/docs
- **Nuxt UI**: https://ui.nuxt.com/components/chart
