<template>
  <v-card>
    <v-card-title>
      <span>簽到狀態</span>
      <v-spacer />

      <v-col sm="4">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="請輸入搜尋內容"
          single-line
          hide-details
        />
      </v-col>
    </v-card-title>
    <v-card-text>
      <v-data-table
        fixed-header
        dense
        :headers="headers"
        :items="dataTable"
        item-key="_id"
        :search="search"
        :items-per-page="100"
        :footer-props="{
          'items-per-page-options': [100, 200, 1000],
        }"
        class="elevation-1"
      >
        <template v-slot:item.seat="{ item }">
          {{ item.seat === '0' ? '無安排' : item.seat }}
        </template>
        <!-- <template v-slot:item.is_check="{ item }">
          {{ item.is_check === '1' ? '已簽到' : '尚未簽到' }}
        </template> -->
        <template v-slot:item.is_gift="{ item }">
          {{ item.is_gift === '1' ? '已抽籤' : '尚未抽籤' }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import backendService from '@/services/backendService';

export default {
  name: 'aberrant',
  data() {
    return {
      search: '',
      headers: [
        { text: '桌號', value: 'seat' },
        { text: '員工編號', value: 'username' },
        { text: '姓名', value: 'name' },
        { text: '英文姓名', value: 'ename' },
        { text: '禮物編號', value: 'gift_id' },
        { text: '是否抽簽', value: 'is_gift' },
        { text: '是否簽到', value: 'is_check_text' },
        { text: '簽到時間', value: 'check_time' },
      ],
      dataTable: [],
    };
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    getHistory() {
      backendService
        .getHistory()
        .then((response) => {
          this.dataTable = response.data;
        })
        .catch((error) => {
          console.log(error.response.data.msg);
        });
    },
  },
};
</script>

<style></style>
