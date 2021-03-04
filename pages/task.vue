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
          item-value="_id"
          item-text="name"
          v-model="selectItemValue"
          @change="onChangeSelect(selectItemValue)"
          dense
        />
      </v-card-text>
    </v-card>
    <br />
    <v-card>
      <v-card-text>
        <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
          <v-tabs-slider color="yellow darken-4" />
          <v-tab
            v-for="(tabItem, index) in tabItems"
            :key="index"
            @change="onChangeTab(tabItem._id)"
          >
            {{ tabItem.name }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(tabItem, index) in tabItems" :key="index">
            <v-card-text>
              <TaskInfo v-model="dataTable" />
            </v-card-text>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import TaskInfo from '@/components/taskInfo.vue';
import backendService from '@/services/backendService';

export default {
  name: 'task',
  data() {
    return {
      tab: null,
      tabItems: [],
      text: ['aa', 'bb', 'cc'],
      selectItem: [],
      selectItemValue: 1,
      dataTable: [],
      tempCategory: [],
    };
  },
  mounted() {
    this.getCategory();
    this.getTask(this.selectItemValue);
  },
  created() {},
  components: {
    TaskInfo,
  },
  methods: {
    getCategory() {
      backendService
        .getCategory()
        .then((response) => {
          this.tempCategory = response.data;

          response.data.forEach((element) => {
            if (
              this.selectItem.findIndex((x) => {
                return x.name === element.category_name;
              }) === -1
            ) {
              this.selectItem.push({
                _id: element._id,
                name: element.category_name,
              });
            }

            if (element.subcategory_name !== null) {
              this.tabItems.push({
                _id: element._id,
                name: element.subcategory_name,
              });
            }
          });
        })
        .catch((error) => {
          console.log(error.response.data.msg);
        });
    },
    getTask(categoryId) {
      backendService
        .getTask(categoryId)
        .then((response) => {
          this.dataTable = response.data;
        })
        .catch((error) => {
          console.log(error.response.data.msg);
        });
    },
    getRefreshTab(categoryId) {
      const selectItemIndex = this.selectItem.findIndex((x) => {
        return x._id === this.selectItemValue;
      });
      const selectItemName = this.selectItem[selectItemIndex].name;

      this.tabItems = [];
      this.tempCategory.forEach((element) => {
        if (element.category_name === selectItemName) {
          if (element.subcategory_name !== null) {
            this.tabItems.push({
              _id: element._id,
              name: element.subcategory_name,
            });
          } else {
            this.tabItems.push({
              _id: categoryId,
              name: this.selectItem[selectItemIndex].name,
            });
          }
        }
      });
    },
    onChangeTab(categoryId) {
      this.getTask(categoryId);
    },
    onChangeSelect(categoryId) {
      this.getTask(categoryId);
      this.getRefreshTab(categoryId);
    },
  },
};
</script>

<style></style>
