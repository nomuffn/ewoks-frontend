module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:vue/recommended'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-console': 'off'
  }
}
