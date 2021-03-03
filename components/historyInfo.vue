<template>
  <v-data-table
    fixed-header
    dense
    :headers="headers"
    :items="this.value"
    item-key="_id"
    :search="search"
    :items-per-page="25"
    :footer-props="{
      'items-per-page-options': [25, 50, 100],
    }"
    class="elevation-1"
  />
</template>

<script>
export default {
  name: 'historyInfo',
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      search: '',
      headers: [
        { text: '編號', value: '_id' },
        { text: '紀錄巡檢問題', value: 'inspection_item_id' },
        { text: '巡檢地點', value: 'site_id' },
        { text: '巡檢狀態', value: 'status' },
        { text: '巡檢詳細說明文字', value: 'description' },
        { text: '巡檢照片路徑', value: 'image_path' },
        { text: '更新時間', value: 'update_time' },
        { text: '紀錄巡檢執行人員', value: 'user_id' },
      ],

      //   cashFlowInfoLoading: true,
      //   cashFlowInfoFilters: {},
      //   selectedColumns: null,
      //   columns: null,
      //   formatCurrencyColumns: [],
      //   formatDateColumns: [],
      //   formatPercentColumns: [],
    };
  },
  mounted() {},
  created() {},
  methods: {},
};
</script>
