const { defineConfig } = require('eslint/config');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
    prettierConfig,
    {
        ignores: ['dist/*', 'node_modules/*', 'eslint.config.js'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: process.cwd(),
            },
        },
    }
]);
