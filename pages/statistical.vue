<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="430"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'statistical',
  data() {
    return {
      series: [
        {
          name: '總務',
          data: [44, 55, 41, 64, 22, 43, 21, 690, 1100, 1200],
        },
        {
          name: '庶務',
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ],
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
          enabled: true,
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
          categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        },
      },
    };
  },
  components: {
    apexchart: VueApexCharts,
  },
  mounted() {},
  methods: {},
};
</script>

<style></style>
