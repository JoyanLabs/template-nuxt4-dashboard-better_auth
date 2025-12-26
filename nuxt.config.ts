import { validateEnv } from './shared/config/env.schema'

// Validar variables de entorno
const env = validateEnv(process.env)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/test-utils',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: env.NUXT_PUBLIC_SITE_URL,
      apiBaseUrl: env.NUXT_PUBLIC_API_BASE_URL
    }
  },

  routeRules: {
    // Proxy para la API del backend (auth, etc.)
    // Específicamente excluir _nuxt_icon del proxy
    '/api/auth/**': {
      proxy: 'http://localhost:3001/api/auth/**'
    }
  },
  compatibilityDate: '2025-12-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    locales: [
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'es',
    langDir: 'locales',
    strategy: 'no_prefix'
  },

  icon: {
    // Usar serverBundle 'remote' para cargar iconos desde CDN (jsDelivr)
    serverBundle: 'remote',
    // Escanear componentes para incluir iconos usados en el bundle del cliente
    clientBundle: {
      scan: true
    }
  }
})
