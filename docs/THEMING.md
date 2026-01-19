# Sistema de Temas Personalizados

Esta guía explica cómo utilizar el sistema de temas personalizados en este proyecto Nuxt con Nuxt UI y Tailwind CSS v4.

## Colores Disponibles

El proyecto cuenta con las siguientes paletas de colores:

| Color | Propósito | Tonos disponibles |
|-------|-----------|-------------------|
| `brand` | Color principal de tu marca | 50-950 |
| `green` | Color primario alternativo | 50-950 |
| `red` | Color rojo de Tailwind | 50-950 |
| **Neutrales** | | |
| `zinc` | Grises neutros (recomendado) | 50-950 |
| `slate` | Grises con tinte azul frío | 50-950 |
| `gray` | Grises verdaderos | 50-950 |
| `neutral` | Grises cálidos | 50-950 |
| `stone` | Grises con tinte marrón | 50-950 |

### Soporte de Navegadores

Los colores están definidos con:
- **HEX** como fallback para navegadores antiguos
- **oklch** y **display-p3** para navegadores modernos con pantallas de gamut amplio

Esto garantiza compatibilidad universal mientras se aprovechan las capacidades de color de pantallas modernas.

## Configuración del Tema

### Tema por Defecto

El tema por defecto está configurado en `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',  // O tu color personalizado 'brand'
      neutral: 'zinc'    // Grises optimizados de Tailwind
    }
  }
})
```

**Nota**: Se usa `zinc` en lugar de grises personalizados porque los colores neutrales de Tailwind están optimizados para funcionar perfectamente en light y dark mode.

### Cambiar el Tema Dinámicamente

Puedes cambiar el tema en tiempo de ejecución usando el composable `useAppConfig()`:

```vue
<script setup>
const appConfig = useAppConfig()

// Cambiar al tema de tu marca
function cambiarATemaBrand() {
  appConfig.ui.colors.primary = 'brand'
  appConfig.ui.colors.neutral = 'zinc'
}

// Cambiar al tema verde
function cambiarATemaVerde() {
  appConfig.ui.colors.primary = 'green'
  appConfig.ui.colors.neutral = 'zinc'
}
</script>

<template>
  <div>
    <UButton @click="cambiarATemaBrand">
      Tema Marca
    </UButton>
    <UButton @click="cambiarATemaVerde">
      Tema Verde
    </UButton>
  </div>
</template>
```

## Uso de Colores en Componentes

### Componentes de Nuxt UI

Los componentes de Nuxt UI automáticamente usan los colores configurados:

```vue
<template>
  <!-- Usa el color primario configurado -->
  <UButton color="primary">
    Botón Primario
  </UButton>
  
  <!-- Usa colores específicos -->
  <UButton color="brand">
    Botón de Marca
  </UButton>
  
  <UButton color="green">
    Botón Verde
  </UButton>
  
  <UButton color="red">
    Botón Rojo (Tailwind)
  </UButton>
</template>
```

### Clases de Tailwind CSS

También puedes usar los colores directamente con clases de Tailwind:

```vue
<template>
  <!-- Fondo de tu marca -->
  <div class="bg-brand-600 text-white">
    Contenido con color de marca
  </div>
  
  <!-- Texto verde -->
  <div class="text-green-600">
    Texto verde
  </div>
  
  <!-- Borde con zinc -->
  <div class="border border-zinc-300">
    Contenido con borde gris
  </div>
</template>
```

### Variables CSS

Los colores están disponibles como variables CSS:

```vue
<style scoped>
.mi-elemento {
  /* Color de marca principal (tono 600) */
  background-color: var(--color-brand-600);
  
  /* Gris zinc de Tailwind */
  border-color: var(--color-zinc-500);
}
</style>
```

## Ejemplo Completo: Selector de Tema

```vue
<script setup>
const appConfig = useAppConfig()
const temaActual = ref('verde')

const temas = {
  brand: {
    primary: 'brand',
    neutral: 'zinc',
    nombre: 'Marca'
  },
  verde: {
    primary: 'green',
    neutral: 'slate',
    nombre: 'Verde'
  }
}

function cambiarTema(tema: 'brand' | 'verde') {
  appConfig.ui.colors.primary = temas[tema].primary
  appConfig.ui.colors.neutral = temas[tema].neutral
  temaActual.value = tema
}
</script>

<template>
  <div>
    <h2>Selector de Tema</h2>
    <USelectMenu
      v-model="temaActual"
      :options="Object.keys(temas)"
      @update:model-value="cambiarTema"
    >
      <template #label>
        Tema: {{ temas[temaActual].nombre }}
      </template>
    </USelectMenu>

    <div class="mt-4">
      <UButton color="primary">
        Botón con color primario
      </UButton>
    </div>
  </div>
</template>
```

## Cómo Crear tu Paleta de Colores Personalizada

### Paso 1: Generar tu Paleta

1. Elige tu color principal (ej: `#3B82F6` - azul)
2. Usa una herramienta como [Tailwind CSS Color Generator](https://uicolors.app/create) o [oklch.com](https://oklch.com)
3. Genera los 11 tonos (50-950)

### Paso 2: Agregar a tu CSS

Edita `app/assets/css/main.css`:

```css
@import "tailwindcss" theme(static);
@import "@nuxt/ui";

@theme static {
  --font-sans: 'Public Sans', sans-serif;

  /* Tu color de marca personalizado */
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-300: #93c5fd;
  --color-brand-400: #60a5fa;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-800: #1e40af;
  --color-brand-900: #1e3a8a;
  --color-brand-950: #172554;
}

/* Soporte para oklch y display-p3 en navegadores modernos */
@supports (color: oklch(0% 0 0)) {
  @media (color-gamut: p3) {
    @theme static {
      /* Tu color de marca con oklch (opcional pero recomendado) */
      --color-brand-50: oklch(97% 0.02 240);
      --color-brand-100: oklch(94% 0.04 240);
      --color-brand-200: oklch(88% 0.08 240);
      --color-brand-300: oklch(78% 0.12 240);
      --color-brand-400: oklch(68% 0.16 240);
      --color-brand-500: oklch(58% 0.18 240);
      --color-brand-600: oklch(50% 0.20 240);
      --color-brand-700: oklch(45% 0.18 240);
      --color-brand-800: oklch(40% 0.15 240);
      --color-brand-900: oklch(35% 0.12 240);
      --color-brand-950: oklch(25% 0.08 240);
    }
  }
}
```

### Paso 3: Configurar como Color Primario

Edita `app.config.ts`:

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',  // Usa tu nuevo color
      neutral: 'zinc'
    }
  }
})
```

## Grises Neutrales de Tailwind

Los colores neutrales de Tailwind están optimizados para funcionar perfectamente en light y dark mode. Características:

- **Muy baja saturación**: Grises verdaderos sin tintes molestos
- **Optimizados para accesibilidad**: Contraste adecuado en ambos modos
- **Consistentes**: Se ven igual de bien en cualquier pantalla

### Zinc (Recomendado)

```
zinc-50:  #fafafa  ← Fondos muy claros
zinc-100: #f4f4f5  ← Fondos claros
zinc-200: #e4e4e7  ← Bordes suaves
zinc-300: #d4d4d8  ← Bordes
zinc-400: #a1a1aa  ← Textos deshabilitados
zinc-500: #71717a  ← Textos secundarios
zinc-600: #52525b  ← Textos en light mode
zinc-700: #3f3f46  ← Fondos en dark mode
zinc-800: #27272a  ← Fondos oscuros
zinc-900: #18181b  ← Fondos muy oscuros
zinc-950: #09090b  ← Fondos ultra oscuros
```

**Por qué usar zinc en lugar de grises personalizados:**
- ✅ Optimizado para light y dark mode
- ✅ Sin tintes que interfieran con el color primario
- ✅ Valores probados y accesibles
- ✅ Funciona perfectamente con todos los componentes de Nuxt UI

## Notas Técnicas

- **Tailwind CSS v4**: El proyecto usa la nueva sintaxis `@theme static` para definir variables CSS
- **Compatibilidad**: Los valores HEX garantizan soporte en todos los navegadores
- **oklch**: Proporciona colores más precisos y uniformes en el espacio de color perceptual
- **display-p3**: Aprovecha el gamut de color amplio de pantallas modernas (iPhones, Macs, etc.)
- **Detección automática**: El navegador selecciona automáticamente el formato de color apropiado

## Referencias

- [Documentación de Nuxt UI](https://ui.nuxt.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [oklch Color Space](https://oklch.com)
- [UI Colors Generator](https://uicolors.app/create)
