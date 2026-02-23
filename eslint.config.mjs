// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Ignorar archivos de assets de skills (ejemplos/templates)
  {
    ignores: ['skills/**/assets/**']
  },
  // Configuración principal con reglas
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 3 }]
    }
  }
)
