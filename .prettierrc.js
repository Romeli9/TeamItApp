module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^(?!react$|react-native$|@react-navigation|react-i18next|@eva-design)(@?\\w)',
    '^[./]',
    '^.+\\.styles(\\.ts)?$',
    '^types/(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderSortByAppearance: true,
};
