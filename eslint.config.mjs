import nx from '@nx/eslint-plugin';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              onlyDependOnLibsWithTags: ['*'],
              sourceTag: '*',
            },
          ],
          enforceBuildableLibDependency: true,
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  {
    ...perfectionist.configs['recommended-natural'],
    rules: {
      // ...perfectionist.configs['recommended-natural'].rules,
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          groups: [
            'base-libraries',
            [
              'value-builtin',
              'value-external',
              'type-builtin',
              'type-external',
            ],
            ['value-internal', 'type-internal'],
            ['value-parent', 'value-sibling', 'value-index'],
            ['type-parent', 'type-sibling', 'type-index'],
            'side-effect-style',
          ],
          customGroups: [
            {
              groupName: 'base-libraries',
              elementNamePattern: [
                '^react$',
                '^react-.+',
                '^next$',
                '^next-.+',
              ],
            },
          ],
          internalPattern: ['^~/.+', '^@/.+', '^@780/.+'],
          tsconfig: { filename: './tsconfig.json', rootDir: './.' },
        },
      ],
    },
  },
];
