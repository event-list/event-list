// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const localePath = path.resolve(__dirname, '..', '..', 'packages/i18n-front/src/locales');

console.log(localePath);

module.exports = {
  reloadOnPrerender: true,
  debug: true,
  localePath,
  i18n: {
    locales: ['ptBR', 'en'],
    defaultLocale: 'ptBR',
    localeStructure: '{{lng}}',
    localeDetection: false,
  },
  ns: [],
  defaultNS: [],
};
