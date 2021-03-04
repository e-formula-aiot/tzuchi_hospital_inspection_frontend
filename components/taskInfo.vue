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
  name: 'taskInfo',
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
        { text: '院區名稱', value: 'organisation_name' },
        { text: '檢查地點名稱', value: 'site_name' },
        // { text: 'category_name', value: 'category_name' },
        // { text: 'subcategory_name', value: 'subcategory_name' },
        { text: '巡檢工作單名稱', value: 'inspection_name' },
        { text: '檢查項目所屬名目', value: 'item_type' },
        { text: '檢查項目問題', value: 'item_question' },
      ],
    };
  },
  mounted() {},
  created() {},
  methods: {},
};
</script>
