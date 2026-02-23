---
name: vue-animations
description: >
  Transiciones Vue y animaciones Tailwind para Nuxt 4.
  Trigger: Cuando se implementan animaciones, transiciones o efectos visuales.
license: MIT
metadata:
  author: template-team
  version: "1.0"
  scope: [root]
  auto_invoke: "Implementando transiciones Vue o animaciones Tailwind"
allowed-tools: Read, Edit, Write, Glob, Grep
---

## When to Use

Usa esta skill cuando:
- Implementas transiciones entre páginas o componentes
- Agregas animaciones a elementos de UI
- Trabajas con transiciones de listas (v-for)

---

## Critical Patterns

### 1. Transiciones Vue

```vue
<template>
  <Transition name="fade">
    <div v-if="show">Content</div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 2. Animaciones Tailwind

```vue
<template>
  <div class="animate-fade-in">
    Content
  </div>
</template>
```

### 3. Transiciones de Grupos

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</TransitionGroup>
```

---

## Resources

- **Vue Transitions**: https://vuejs.org/guide/built-ins/transition.html
- **Tailwind Animations**: https://tailwindcss.com/docs/animation
