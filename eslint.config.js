// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'build/**',
    'packaged/**',
    'node_modules/**',
    '*.php',
    '*.md',
    '*.json',
    '*.yaml',
    '*.yml',
  ],
})
