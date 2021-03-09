<template>
  <div>
    <snackbar v-model="snackbarData" />

    <v-card>
      <v-card-title>
        <span>統計分析</span>
      </v-card-title>
      <v-card-text>
        <v-row>
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
        <div id="chart">
          <apexchart
            type="bar"
            height="430"
            :options="chartOptions"
            :series="series"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import backendService from '@/services/backendService';

export default {
  name: 'statistical',
  data() {
    return {
      snackbarData: undefined,
      // series: [
      //   {
      //     name: '總務',
      //     data: [44, 55, 41, 64, 22, 43, 21, 690, 1100, 1200],
      //   },
      //   {
      //     name: '庶務',
      //     data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
      //   },
      // ],
      series: [],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 430,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: false,
          offsetX: 0,
          style: {
            fontSize: '12px',
            colors: ['#fff'],
          },
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff'],
        },
        xaxis: {
          categories: [],
        },
      },
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
  components: {
    apexchart: VueApexCharts,
  },
  mounted() {
    this.getSummaryByCategory(
      this.$moment(this.dateStart)
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss'),
      this.$moment(this.dateEnd)
        .utc()
        .add(1, 'days')
        .format('YYYY-MM-DDTHH:mm:ss'),
    );
  },
  methods: {
    getSummaryByCategory(inspectionTimeStart, inspectionTimeEnd) {
      backendService
        .getSummaryByCategory(inspectionTimeStart, inspectionTimeEnd)
        .then((response) => {
          let tempSubcategoryName = '';
          const tempNG = [];
          const tempNGNotRecovered = [];
          const tempNGRecovered = [];
          const tempOK = [];
          const tempAudited = [];
          const tempTotal = [];

          response.data.forEach((element) => {
            if (element.subcategory_name !== null) {
              tempSubcategoryName = `${element.category_name}-${element.subcategory_name}`;
            } else {
              tempSubcategoryName = `${element.category_name}`;
            }
            this.chartOptions.xaxis.categories.push(tempSubcategoryName);

            tempNG.push(element.NG);
            tempNGNotRecovered.push(element.NG_not_recovered);
            tempNGRecovered.push(element.NG_recovered);
            tempOK.push(element.OK);
            tempAudited.push(element.audited);
            tempTotal.push(element.total);
          });

          this.series.push(
            {
              name: '異常',
              data: tempNG,
            },
            {
              name: '異常未修復',
              data: tempNGNotRecovered,
            },
            {
              name: '異常已修復',
              data: tempNGRecovered,
            },
            {
              name: '正常',
              data: tempOK,
            },
            {
              name: '已稽核',
              data: tempAudited,
            },
            {
              name: '巡檢總次數',
              data: tempTotal,
            },
          );
        })
        .catch((error) => {
          this.snackbarData = {
            snackbar: true,
            snackbar_msg: error.response.data.msg,
          };
        });
    },
    onClickSubmit() {
      this.series = [];
      this.chartOptions.xaxis.categories = [];

      this.getSummaryByCategory(
        this.$moment(this.dateStart)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss'),
        this.$moment(this.dateEnd)
          .utc()
          .add(1, 'days')
          .format('YYYY-MM-DDTHH:mm:ss'),
      );
    },
  },
};
</script>

<style></style>
