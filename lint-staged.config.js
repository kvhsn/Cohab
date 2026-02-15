module.exports = {
  'packages/ui/**/*.{js,jsx,ts,tsx}': (files) => [
    `prettier --write ${files.join(' ')}`,
  ],
  'packages/api/src/**/*.{js,jsx,ts,tsx}': (files) => [
    `prettier --write ${files.join(' ')}`,
  ],
  '*.{json,md,yaml,yml}': (files) => [`prettier --write ${files.join(' ')}`],
};
