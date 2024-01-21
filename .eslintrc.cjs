module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-vars': 'off', // Add this line
    'react/display-name': 'off', // Add this line
    'react/prop-types': 'off', // Add this line
    'react/no-unknown-property': 'off', // Add this line
    'react-hooks/rules-of-hooks': 'off',
  },
}

/* eslint-disable react-hooks/rules-of-hooks */