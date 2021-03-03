const messages = {
  en: require('./en.json'),
};

const i18n = {
  locales: Object.keys(messages),
  defaultLocale: 'en',
  vueI18n: {
    fallbackLocale: 'en',
    messages,
  },
};

export default i18n;
