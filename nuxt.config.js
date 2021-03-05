import colors from 'vuetify/es5/util/colors';
import i18n from './locales/i18n';

const isDev = process.env.NODE_ENV === 'development';
const baseUrl = isDev
  ? process.env.DEVELOPMENT_PREFIX
  : process.env.PRODUCTION_PREFIX;
const proxy = {};
if (isDev) {
  proxy[process.env.DEVELOPMENT_BACKEND_URL] = {
    target: `${process.env.DEVELOPMENT_BACKEND_PROXY_TARGET_URL}`,
    pathRewrite: { [`^${process.env.DEVELOPMENT_BACKEND_URL}`]: '' },
  };
}

export default {
  env: {
    baseUrl,
    backendUrl: isDev
      ? process.env.DEVELOPMENT_BACKEND_URL
      : process.env.PRODUCTION_BACKEND_URL,
  },

  router: {
    base: baseUrl,
  },

  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - tzuchi_hospital_inspection',
    title: 'tzuchi_hospital_inspection_frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${baseUrl}/favicon.ico` },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://github.com/nuxt-community/proxy-module
    '@nuxtjs/proxy',
    // https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://i18n.nuxtjs.org
    'nuxt-i18n',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: isDev,
  },

  proxy,

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.blue,
          accent: colors.shades.black,
          error: colors.red.accent3,
        },
      },
    },
  },

  // Vuetify module configuration (https://i18n.nuxtjs.org/options-reference)
  i18n,

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
};
