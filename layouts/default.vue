<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
      left
      dark
      width="180"
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      clipped-left
      fixed
      app
      v-if="this.$route.path !== '/' && this.$route.path !== ''"
      class="white--text blue darken-1"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <a :href="`${$nuxt.context.env.baseUrl}/task`">
        <v-img max-width="40" :src="`${$nuxt.context.env.baseUrl}/logo.png`" />
      </a>
      <strong><h3>慈濟巡檢後台管理系統</h3></strong>
      <v-spacer />

      Hi, {{ userName }}
      <v-btn
        to="/"
        key="/"
        link
        router
        text
        rounded
        class="my-2 white--text"
        @click="onCloseMenu"
      >
        <strong>登出</strong>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer padless app>
      <v-card class="flex" flat tile>
        <v-card-text class="py-2 white--text text-center blue darken-3">
          <strong>
            Copyright &copy;
            {{ new Date().getFullYear() }}
            e-Formula Technologies Inc All rights reserved.</strong
          >
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined;

export default {
  data() {
    return {
      drawer: false,
      miniVariant: false,
      items: [
        {
          icon: 'mdi-text-box-search-outline',
          title: '巡檢清單',
          to: '/task/',
        },
        {
          icon: 'mdi-text-box-remove-outline',
          title: '巡檢紀錄',
          to: '/aberrant',
        },
        {
          icon: 'mdi-align-vertical-bottom',
          title: '統計分析',
          to: '/statistical/',
        },
        {
          icon: 'mdi-file-tree-outline',
          title: '組織管理',
          to: '/organization/',
        },
        {
          icon: 'mdi-account-group',
          title: '人員管理',
          to: '/account/',
        },
      ],
      userName:
        Cookie.get('username') !== undefined ? Cookie.get('username') : '',
    };
  },
  methods: {
    onCloseMenu() {
      this.drawer = false;
    },
  },
};
</script>
