<template>
  <div>
    <snackbar v-model="snackbarData" />

    <v-card>
      <v-card-title>
        <span>人員管理</span>
      </v-card-title>
      <v-card-text>
        <v-data-table
          fixed-header
          dense
          :headers="headers"
          :items="dataTable"
          item-key="_id"
          :search="search"
          :items-per-page="25"
          :footer-props="{
            'items-per-page-options': [25, 50, 100],
          }"
          class="elevation-1"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import backendService from '@/services/backendService';

export default {
  name: 'account',
  data() {
    return {
      snackbarData: undefined,

      search: '',
      headers: [
        { text: '工號', value: 'employee_id' },
        { text: '姓名', value: 'user_name' },
        { text: '稱謂', value: 'user_title' },
        { text: 'Email', value: 'email' },
        { text: '紀錄人員所屬部門', value: 'deparment_id' },
        { text: '紀錄 Line ID', value: 'line_user_id' },
      ],
      dataTable: [],
    };
  },
  mounted() {
    this.getUser();
  },
  created() {},
  components: {},
  methods: {
    getUser() {
      backendService
        .getUser()
        .then((response) => {
          this.dataTable = response.data;
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
  },
};
</script>

<style></style>
