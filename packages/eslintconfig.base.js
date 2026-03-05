const { defineConfig } = require('eslint/config');
const prettierConfig = require('eslint-config-prettier');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = defineConfig([
    {
        ignores: ['dist/**', 'node_modules/**', 'eslint.config.js'],
    },
    prettierConfig,
    {
        plugins: {
            'unused-imports': unusedImports,
        },
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: process.cwd(),
            },
        },
        rules: {
            'unused-imports/no-unused-imports': 'warn',
        },
    }
]);
