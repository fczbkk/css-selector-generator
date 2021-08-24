const rules = {
  'semi': [
    'warn',
    'never'
  ],
  'max-len': [
    'warn',
    {
      'ignoreComments': true
    }
  ],
  'function-paren-newline': ['error', 'consistent']
}

// eslint-disable-next-line no-undef
module.exports = {
  'extends': '@fczbkk',
  'parserOptions': {
    'sourceType': 'module'
  },
  'env': {
    'es6': true,
    'browser': true
  },
  'rules': rules,
  'overrides': [
    {
      'files': ['src/*.ts'],
      'extends': [
        '@fczbkk',
        'plugin:@typescript-eslint/recommended'
      ],
      'parser': '@typescript-eslint/parser',
      'plugins': [
        '@typescript-eslint'
      ],
      'rules': rules
    }
  ],
  'root': true
}
