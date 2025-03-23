import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const compat = new FlatCompat();

export default [
    js.configs.recommended,
    ...compat.extends(
        'plugin:react-hooks/recommended'
    ),
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            'react-refresh': reactRefresh,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node
            },
        },
        rules: {
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
];
