module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
};
