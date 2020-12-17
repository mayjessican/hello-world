// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//     'react-native/react-native': true,
//   },
//   extends: [
//     'plugin:react/recommended',
//     'airbnb',
//   ],
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//     ecmaVersion: 12,
//     sourceType: 'module',
//   },
//   parser: 'babel-eslint',
//   plugins: [
//     'react',
//     'react-native',
//   ],
//   rules: {
//   },
// };

module.exports = {
  env: {
    'react-native/react-native': true,
  },
  parser: 'babel-eslint',
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-native'],
  rules: {},
};
