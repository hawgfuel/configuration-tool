module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'airbnb-typescript',
  ],
  rules: {
    // Place to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    // eslint-disable-next-line @typescript-eslint/quotes
    'max-len': ['error', { comments: 120, code: 100 }],
    'linebreak-style': 'off',
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/label-has-associated-control': [2, { assert: 'either' }],
    'import/prefer-default-export': 'off',
  },
};
