<template>
  <div>
    <v-card>
      <v-card-title>
        <span>巡檢清單</span>
      </v-card-title>
      <v-card-text>
        <v-select
          :items="selectItem"
          label="工作單"
          dense
          v-model="selectItemValue"
          @change="onChangeSelect(selectItemValue)"
        />
      </v-card-text>
    </v-card>
    <br />
    <v-card>
      <v-card-text>
        <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
          <v-tabs-slider color="yellow darken-4" />
          <v-tab
            v-for="tabItem in tabItems"
            :key="tabItem"
            @change="onChangeTab(tabItems)"
          >
            {{ tabItem }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="tabItem in tabItems" :key="tabItem">
            <v-card-text>
              <HistoryInfo v-model="dataTable" />
            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import HistoryInfo from '@/components/historyInfo.vue';
// import backendService from '@/services/backendService';

export default {
  name: 'history',
  data() {
    return {
      tab: null,
      tabItems: ['資財', '警勤', '庶務'],
      text: ['aa', 'bb', 'cc'],
      selectItem: ['1', '2', '3'],
      selectItemValue: '1',
      dataTable: [
        {
          _id: 'aa',
          inspection_item_id: 0,
        },
        {
          _id: 'bb',
          inspection_item_id: 1,
        },
      ],
    };
  },
  mounted() {
    // this.getHistory();
  },
  components: {
    HistoryInfo,
  },
  methods: {
    // getHistory() {
    //   backendService
    //     .getHistory()
    //     .then((response) => {
    //       this.dataTable = response.data;
    //     })
    //     .catch((error) => {
    //       console.log(error.response.data.msg);
    //     });
    // },
    onChangeTab(data) {
      // console.log(data);
      this.dataTable = [
        {
          _id: 'cc',
          inspection_item_id: 2,
        },
        {
          _id: 'dd',
          inspection_item_id: 3,
        },
      ];
    },
    onChangeSelect(data) {
      console.log(data);
    },
  },
};
</script>

<style></style>
