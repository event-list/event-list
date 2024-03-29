// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  reloadOnPrerender: true,
  debug: false,
  localePath: path.resolve(__dirname, '..', '..', 'packages/i18n-front/src/locales'),
  i18n: {
    locales: ['ptBR', 'en'],
    defaultLocale: 'ptBR',
    localeStructure: '{{lng}}',
    localeDetection: false,
  },
  ns: [],
  defaultNS: [],
};
