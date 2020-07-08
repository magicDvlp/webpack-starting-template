module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
    'amd': true,
    'jquery': true,
  },
  'extends': [
    'eslint:recommended',
    'google',
  ],
  // 'globals': {
  //   'Atomics': 'readonly',
  //   'SharedArrayBuffer': 'readonly',
  //   'google': 'writable',
  //   'url': 'writable',
  // },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    // 'no-console': 'off',
    'linebreak-style': 0,
    'require-jsdoc': 0,
    'arrow-parens': 0,
  },
};
