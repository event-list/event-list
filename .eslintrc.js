module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],

    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
        ],

        pathGroups: [
          {
            pattern: '@event-list/**',
            group: 'internal',
            position: 'after',
          },
        ],

        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },

        'newlines-between': 'always',

        pathGroupsExcludedImportTypes: [],
      },
    ],

    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    ecmaFeatures: {
      jsx: true,
    },

    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      },
    },

    react: {
      version: 'detect',
    },
  },
};
