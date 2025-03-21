
// Default Prettier code style, to ensure same code style across all projects.
const DEFAULT_PRETTIER_CONFIG = {
    // Disables annoying issue, when people with Windows and Linux environments are working
    //   on same project. Linux has only LF at the end of line, while Windows has CRLF. This
    //   results in dirty git history. In my opinion, best strategy is to turn off "core.autocrlf"
    //   on Windows and commit "as is".
    endOfLine: 'auto',
    tabWidth: 4,
    printWidth: 120,
    trailingComma: 'all',
    singleQuote: true,
    useTabs: false,
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    embeddedLanguageFormatting: 'auto',
    jsxSingleQuote: false,
};

let prettierConfig = DEFAULT_PRETTIER_CONFIG;

try {
    prettierConfig = require('prettier').resolveConfig.sync(process.cwd());
} catch {
    console.warn('Cannot find prettier configuration file - fallback to defaults');
}

module.exports = {
    // Using Typescript parser, because it works both with JavaScript and TypeScript files.
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        // Plugin to glue Prettier and ESLint together.
        'prettier',
        // Useful rules when working with TypeScript.
        '@typescript-eslint',
        // Rules for package.json workspaces
        'workspaces',
        // Lodash-specific rules, to do some optimizations
        'lodash',
        // Some great ESLint rules from xo (https://github.com/xojs/xo)
        'unicorn',
        // Plugin for sorting imports
        'import',
    ],
    extends: [
        // Recommended ESLint code style.
        'eslint:recommended',
        // Prettier plugin recommended configuration, which disables conflicting rules from ESLint.
        'plugin:prettier/recommended',
        // Recommended configuration for TypeScript
        'plugin:@typescript-eslint/recommended',
        // Great defaults from xo
        'plugin:unicorn/recommended',
    ],
    // Rules that are default for all source files.
    rules: {
        'prettier/prettier': ['escalate', prettierConfig],
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'escalate',
        '@typescript-eslint/no-empty-function': 'escalate',
        'array-callback-return': ['error', { checkForEach: true, allowImplicit: false }],
        'capitalized-comments': 'off',
        curly: ['escalate', 'all'],
        // Ensure consistent import ordering.
        'import/order': [
            'escalate',
            {
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type', 'object'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        // Lodash optimization.
        'lodash/import-scope': ['escalate', 'method'],
        // Workspace configurations.
        'workspaces/no-relative-imports': 'escalate',
        'workspaces/no-absolute-imports': 'escalate',
        'workspaces/require-dependency': 'escalate',
        // Disallow regular expressions with exponential time complexity.
        'unicorn/no-unsafe-regex': 'error',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-ternary': 'off',
        'unicorn/no-array-callback-reference': 'off',
    },
    overrides: [
        {
            files: '**/*.config.{js,cjs,mjs}',
            env: {
                node: true,
            },
            rules: {
                'unicorn/prevent-abbreviations': 'off',
                'unicorn/prefer-module': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                'no-console': 'off',
            },
        },
        {
            files: '**/*.{tsx,jsx}',
            extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:react/jsx-runtime'],
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            settings: {
                react: {
                    version: 'detect',
                },
            },
            env: {
                browser: true,
            },
            rules: {
                'no-console': 'escalate',
                'react/prop-types': 'off',
                'react/display-name': 'off',
                'react-hooks/exhaustive-deps': 'escalate',
                '@typescript-eslint/no-unused-vars': ['escalate', { varsIgnorePattern: 'React' }],
                'unicorn/prevent-abbreviations': [
                    'escalate',
                    {
                        replacements: {
                            props: {
                                properties: false,
                            },
                        },
                    },
                ],
            },
        },
    ],
};
