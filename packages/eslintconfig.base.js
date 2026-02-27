const { defineConfig } = require('eslint/config');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
    {
        ignores: ['dist/**', 'node_modules/**', 'eslint.config.js'],
    },
    prettierConfig,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: process.cwd(),
            },
        },
    }
]);
