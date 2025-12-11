const config = {
  // TypeScript type checking
  '**/*.{ts,tsx,vue}': () => 'nuxi typecheck',

  // ESLint for all JS/TS/Vue files
  '**/*.{js,jsx,mjs,cjs,ts,tsx,mts,vue}': ['eslint --fix']
}

export default config
