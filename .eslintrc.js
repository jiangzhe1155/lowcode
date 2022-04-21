module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    "vue/multi-word-component-names": ["error", {
      "ignores": ['Root','Page','Card','Dialog','Table']
    }]
  }
};
