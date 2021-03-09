<template>
  <div>
    <snackbar v-model="snackbarData" />

    <v-card>
      <v-card-title>
        <span>巡檢清單</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-select
              :items="selectItem"
              label="工作單"
              item-value="_id"
              item-text="name"
              v-model="selectItemValue"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-menu
              ref="menuStart"
              v-model="menuStart"
              :close-on-content-click="false"
              :return-value.sync="dateStart"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateStart"
                  label="開始日期"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="dateStart" no-title scrollable>
                <v-spacer />
                <v-btn text color="primary" @click="menuStart = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menuStart.save(dateStart)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-menu
              ref="menuEnd"
              v-model="menuEnd"
              :close-on-content-click="false"
              :return-value.sync="dateEnd"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateEnd"
                  label="結束日期"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="dateEnd" no-title scrollable>
                <v-spacer />
                <v-btn text color="primary" @click="menuEnd = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menuEnd.save(dateEnd)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn rounded color="primary" @click="onClickSubmit">
              查詢
            </v-btn>
          </v-col>
        </v-row>
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
      snackbarData: undefined,
      tab: null,
      tabItems: [],
      selectItem: [],
      selectItemValue: 1,
      dataTable: [],
      tempCategory: [],
      dateStart: this.$moment
        .utc()
        .local()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
      dateEnd: this.$moment
        .utc()
        .local()
        .format('YYYY-MM-DD'),
      menuStart: false,
      menuEnd: false,
    };
  },
  mounted() {
    this.getCategory();
    this.getTask(
      this.selectItemValue,
      this.$moment(this.dateStart)
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss'),
      this.$moment(this.dateEnd)
        .utc()
        .add(1, 'days')
        .format('YYYY-MM-DDTHH:mm:ss'),
    );
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
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    getTask(categoryId, inspectionTimeStart, inspectionTimeEnd) {
      backendService
        .getTask(categoryId, inspectionTimeStart, inspectionTimeEnd)
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
      this.getTask(
        categoryId,
        this.$moment(this.dateStart)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss'),
        this.$moment(this.dateEnd)
          .utc()
          .add(1, 'days')
          .format('YYYY-MM-DDTHH:mm:ss'),
      );
    },
    onClickSubmit() {
      this.getTask(
        this.selectItemValue,
        this.$moment(this.dateStart)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss'),
        this.$moment(this.dateEnd)
          .utc()
          .add(1, 'days')
          .format('YYYY-MM-DDTHH:mm:ss'),
      );
      this.getRefreshTab(this.selectItemValue);
    },
  },
};
</script>

<style></style>
