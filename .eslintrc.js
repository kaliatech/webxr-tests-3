module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript/recommended',
    'prettier',
  ],
  // "extends": [
  //   "plugin:@typescript-eslint/eslint-recommended",
  //   "plugin:@typescript-eslint/recommended",
  //   "@vue/typescript/recommended",
  //   "plugin:vue/vue3-recommended",
  //   "prettier"
  // ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // "vue/no-unused-vars" : "error"
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  ignorePatterns: [
    'dist/*',
  ],
  overrides: [
    {
      files: ["*.ts", "*.vue"],
      rules: {
        "no-undef": "off" // https://stackoverflow.com/questions/60743389/eslint-defined-global-extensions-still-not-defined-no-undef
      }
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
