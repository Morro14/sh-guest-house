module.exports = {
  contextSeparator: '_',
  createOldCatalogs: false,
  defaultNamespace: 'translation',
  defaultValue: '',
  indentation: 2,
  keepRemoved: false,
  keySeparator: false,
  locales: ['en'],
  output: 'src/i18n/locales/$LOCALE/translation.json',
  input: ['app/**/*.{js,jsx,ts,tsx}'],
  useKeysAsDefaultValue: false,
  verbose: true,
  failOnWarnings: false,
  lexers: {
    js: ['JsxLexer'], // important for Vite + React
    jsx: ['JsxLexer'],
    ts: ['JsxLexer'],
    tsx: ['JsxLexer']
  }
};
