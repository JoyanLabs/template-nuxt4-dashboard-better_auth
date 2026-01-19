# Guía de Internacionalización (i18n)

Esta documentación explica cómo implementar y mantener el sistema de traducciones en el proyecto usando `@nuxtjs/i18n`.

---

## 📋 Tabla de Contenidos

1. [Configuración](#configuración)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Uso en Componentes](#uso-en-componentes)
4. [Uso en Templates](#uso-en-templates)
5. [Cambio de Idioma](#cambio-de-idioma)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Añadir Nuevas Traducciones](#añadir-nuevas-traducciones)

---

## Configuración

**Módulo usado:** `@nuxtjs/i18n`

**Configuración:** `nuxt.config.ts`

```typescript
i18n: {
  locales: [
    { code: 'es', name: 'Español', file: 'es.json' },
    { code: 'en', name: 'English', file: 'en.json' }
  ],
  defaultLocale: 'es',
  lazy: true,
  langDir: 'i18n/locales/',
  strategy: 'no_prefix'
}
```

**Idiomas disponibles:**
- 🇪🇸 Español (es) - Por defecto
- 🇬🇧 English (en)

---

## Estructura de Archivos

```
i18n/
└── locales/
    ├── es.json    # Traducciones en español
    └── en.json    # Traducciones en inglés
```

### Estructura de los JSON

Los archivos de traducción están organizados por módulos:

```json
{
  "navigation": {
    "home": "Inicio",
    "inbox": "Bandeja",
    "customers": "Clientes"
  },
  "dashboard": {
    "home": "Dashboard",
    "stats": {
      "users": "Usuarios",
      "orders": "Pedidos"
    },
    "table": {
      "id": "ID",
      "name": "Nombre"
    }
  },
  "settings": {
    "general": {
      "profile": {
        "title": "Perfil",
        "nameLabel": "Nombre"
      }
    }
  },
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar"
  }
}
```

**Organización recomendada:**
- `navigation.*` - Menús y navegación
- `dashboard.*` - Dashboard y estadísticas
- `customers.*` - Módulo de clientes
- `settings.*` - Configuraciones
- `common.*` - Textos comunes reutilizables
- `auth.*` - Autenticación

---

## Uso en Componentes

### Composable `useI18n()`

```vue
<script setup lang="ts">
const { t, locale, setLocale } = useI18n()

// Usar traducción
const title = t('dashboard.home')

// Obtener idioma actual
console.log(locale.value) // 'es' o 'en'

// Cambiar idioma
const changeLanguage = (lang: 'es' | 'en') => {
  setLocale(lang)
}
</script>
```

### Traducciones con Parámetros

```vue
<script setup lang="ts">
const { t } = useI18n()

// JSON: "welcome": "Bienvenido, {name}"
const message = t('common.welcome', { name: 'Juan' })
// Resultado: "Bienvenido, Juan"
</script>
```

### Traducciones con Pluralización

```json
{
  "items": "No hay items | 1 item | {count} items"
}
```

```vue
<script setup lang="ts">
const { t } = useI18n()

t('items', 0)  // "No hay items"
t('items', 1)  // "1 item"
t('items', 5)  // "5 items"
</script>
```

---

## Uso en Templates

### Función `$t()`

```vue
<template>
  <div>
    <h1>{{ $t('dashboard.home') }}</h1>
    <p>{{ $t('dashboard.stats.users') }}</p>
  </div>
</template>
```

### Computed con Traducciones

```vue
<script setup lang="ts">
const { t } = useI18n()

const columns = computed(() => [
  {
    header: t('dashboard.table.id'),
    accessorKey: 'id'
  },
  {
    header: t('dashboard.table.name'),
    accessorKey: 'name'
  }
])
</script>
```

### Traducciones Reactivas

```vue
<script setup lang="ts">
const { t, locale } = useI18n()

// ⚠️ NO reactivo (se calcula una sola vez)
const title = t('dashboard.home')

// ✅ Reactivo (se actualiza al cambiar idioma)
const title = computed(() => t('dashboard.home'))
</script>
```

---

## Cambio de Idioma

### Componente ULocaleSelect (Nuxt UI)

```vue
<script setup lang="ts">
import { es, en } from '@nuxt/ui/locale'

const { locale, setLocale } = useI18n()

const handleLocaleChange = (value: string) => {
  setLocale(value as 'es' | 'en')
}
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="[es, en]"
    @update:model-value="handleLocaleChange"
  />
</template>
```

### En Dropdown Menu

```vue
<script setup lang="ts">
import { es, en } from '@nuxt/ui/locale'

const { t, locale, setLocale } = useI18n()

const handleLocaleChange = (value: string) => {
  setLocale(value as 'es' | 'en')
}

const items = computed(() => [[{
  label: t('settings.security.language.title'),
  slot: 'locale-selector',
  onSelect(e: Event) {
    // Prevenir cierre del dropdown
    e.preventDefault()
  }
}]])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton icon="i-lucide-plus" />
    
    <template #locale-selector>
      <div class="px-2 py-1.5">
        <ULocaleSelect
          :model-value="locale"
          :locales="[es, en]"
          @update:model-value="handleLocaleChange"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
```

---

## Mejores Prácticas

### ✅ HACER

1. **Agrupar traducciones por módulo**
   ```json
   {
     "customers": {
       "title": "Clientes",
       "table": { ... },
       "modals": { ... }
     }
   }
   ```

2. **Usar `computed` para reactividad**
   ```typescript
   const title = computed(() => t('dashboard.home'))
   ```

3. **Traducir todos los textos visibles**
   - Labels de formularios
   - Botones
   - Mensajes de error
   - Tooltips
   - Placeholders importantes

4. **Usar nombres descriptivos en inglés para las keys**
   ```json
   {
     "customers": {
       "table": {
         "columns": {
           "name": "Nombre"
         }
       }
     }
   }
   ```

5. **Reutilizar traducciones comunes**
   ```json
   {
     "common": {
       "save": "Guardar",
       "cancel": "Cancelar",
       "delete": "Eliminar"
     }
   }
   ```

### ❌ NO HACER

1. **No traducir datos dinámicos**
   ```json
   // ❌ MAL
   {
     "users": {
       "johnDoe": "John Doe"
     }
   }
   ```

2. **No traducir placeholders de emails**
   ```json
   // ❌ MAL - El @ causa errores de parsing
   {
     "emailPlaceholder": "john@example.com"
   }
   ```

3. **No usar traducciones para valores técnicos**
   ```json
   // ❌ MAL
   {
     "roles": {
       "admin": "Administrador"
     }
   }
   // ✅ BIEN - Traducir solo la etiqueta visible
   {
     "roles": {
       "labels": {
         "admin": "Administrador"
       }
     }
   }
   ```

4. **No hardcodear textos en componentes**
   ```vue
   <!-- ❌ MAL -->
   <UButton label="Guardar" />
   
   <!-- ✅ BIEN -->
   <UButton :label="$t('common.save')" />
   ```

---

## Añadir Nuevas Traducciones

### Checklist

1. **Identificar el módulo apropiado**
   - ¿Es navegación? → `navigation.*`
   - ¿Es del dashboard? → `dashboard.*`
   - ¿Es texto común? → `common.*`

2. **Añadir en ambos idiomas**
   ```json
   // es.json
   {
     "myModule": {
       "title": "Mi Título"
     }
   }
   
   // en.json
   {
     "myModule": {
       "title": "My Title"
     }
   }
   ```

3. **Usar en componentes**
   ```vue
   <template>
     <h1>{{ $t('myModule.title') }}</h1>
   </template>
   ```

4. **Verificar reactividad**
   - Cambiar idioma en el selector
   - Verificar que el texto se actualiza

---

## Ejemplo Completo: Nuevo Módulo

### 1. Añadir traducciones

**i18n/locales/es.json**
```json
{
  "products": {
    "title": "Productos",
    "table": {
      "columns": {
        "id": "ID",
        "name": "Nombre",
        "price": "Precio",
        "stock": "Stock"
      }
    },
    "modals": {
      "add": {
        "title": "Nuevo Producto",
        "button": "Crear Producto"
      }
    },
    "filters": {
      "all": "Todos",
      "inStock": "En Stock",
      "outOfStock": "Agotados"
    }
  }
}
```

**i18n/locales/en.json**
```json
{
  "products": {
    "title": "Products",
    "table": {
      "columns": {
        "id": "ID",
        "name": "Name",
        "price": "Price",
        "stock": "Stock"
      }
    },
    "modals": {
      "add": {
        "title": "New Product",
        "button": "Create Product"
      }
    },
    "filters": {
      "all": "All",
      "inStock": "In Stock",
      "outOfStock": "Out of Stock"
    }
  }
}
```

### 2. Crear componente

```vue
<script setup lang="ts">
const { t } = useI18n()

const columns = computed(() => [
  {
    header: t('products.table.columns.id'),
    accessorKey: 'id'
  },
  {
    header: t('products.table.columns.name'),
    accessorKey: 'name'
  }
])
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="$t('products.title')" />
    </template>
    
    <template #body>
      <UTable :columns="columns" :data="[]" />
    </template>
  </UDashboardPanel>
</template>
```

### 3. Añadir al menú de navegación

```typescript
const links = computed(() => [[
  {
    label: t('navigation.home'),
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: t('navigation.products'),
    icon: 'i-lucide-package',
    to: '/products'
  }
]])
```

---

## Errores Comunes y Soluciones

### Error: "Invalid linked format"

**Causa:** El símbolo `@` en los archivos JSON se interpreta como formato especial.

```json
// ❌ Causa error
{
  "emailPlaceholder": "user@example.com"
}
```

**Solución:** No traducir emails o usar escape:
```json
// ✅ Correcto
{
  "emailLabel": "Correo electrónico"
}
```

### Error: Traducciones no se actualizan

**Causa:** No usar `computed` para traducciones reactivas.

```vue
// ❌ No reactivo
const title = t('dashboard.home')

// ✅ Reactivo
const title = computed(() => t('dashboard.home'))
```

### Error: "Not found key"

**Causa:** La key no existe en el archivo de idioma actual.

**Solución:** Verificar que existe en ambos archivos (es.json y en.json):
```bash
# Buscar key faltante
grep -r "myKey" i18n/locales/
```

---

## Resumen Rápido

| Caso de Uso | Código |
|-------------|--------|
| Traducir texto en template | `{{ $t('module.key') }}` |
| Traducir en script | `t('module.key')` |
| Traducción reactiva | `computed(() => t('key'))` |
| Cambiar idioma | `setLocale('en')` |
| Idioma actual | `locale.value` |
| Traducción con parámetros | `t('key', { name: 'Juan' })` |

---

## Referencias

- [Nuxt i18n Documentation](https://i18n.nuxtjs.org/)
- [Vue i18n Documentation](https://vue-i18n.intlify.dev/)
- [Nuxt UI Locale Select](https://ui.nuxt.com/components/locale-select)
