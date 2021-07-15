<template>
  <section>
    <el-scrollbar
      class="default-scrollbar"
      wrap-class="default-scrollbar__wrap"
      view-class="p20-scrollbar__view"
    >
      <el-row :gutter="24">
        <el-col :sm="12" :xs="24" class="echarts-item">
          <div class="content-title">周访问柱状图 Top8</div>
          <ve-histogram
            :data="histogramChartDataWeek"
            :settings="histogramChartSettingsWeek"
            :mark-line="histogramChartMarkLine"
          ></ve-histogram>
        </el-col>
        <el-col :sm="12" :xs="24" class="echarts-item">
          <div class="content-title">7天访问曲线图</div>
          <ve-line
            :data="lineChartData7Day"
            :extend="extend"
            :settings="lineChartSettings7Day"
            :mark-point="lineChartMarkPoint"
          ></ve-line>
        </el-col>
        <el-col :sm="12" :xs="24" class="echarts-item">
          <div class="content-title">24小时访问图</div>
         <ve-line
            :data="lineChartData24Hour"
            :settings="lineChartSettings24Hour"
            :mark-point="lineChartMarkPoint"
          ></ve-line>
        </el-col>
        <el-col :sm="12" :xs="24" class="echarts-item">
          <div class="content-title">环形图</div>
          <ve-ring :data="ringChartData" :settings="ringChartSettings"></ve-ring>
        </el-col>
      </el-row>
    </el-scrollbar>
  </section>
</template>

<script>
import Vue from "vue";
import VCharts from "v-charts";
Vue.use(VCharts);
import { getRequestApiinfoByWeek, getAccessApiByDate,getAccessApiByHour } from "../../api/api";

export default {
  name: "AdminDashboard",
  data() {
    return {
      histogramChartDataWeek: {
        columns: [],
        rows: []
      },
      extend: {
        series: {
          label: {
            normal: {
              show: true
            }
          }
        }
      },
      histogramChartSettingsWeek: {},
      histogramChartMarkLine: {
      },
      lineChartData7Day: {
        columns: [],
        rows: []
      },
      lineChartSettings7Day: {
        metrics: ["count"],
        dimension: ["date"]
      },
      lineChartData24Hour: {
        columns: [],
        rows: []
      },
      lineChartSettings24Hour: {
        metrics: ["count"],
        dimension: ["date"]
      },
      lineChartMarkPoint: {
        data: [
          {
            name: "最大值",
            type: "max"
          },
          {
            name: "最小值",
            type: "min"
          }
        ]
      },
      pieChartData: {
        columns: ["日期", "成本", "利润"],
        rows: [
          {
            日期: "1月1号",
            成本: 123,
            利润: 3
          },
          {
            日期: "1月2号",
            成本: 1223,
            利润: 6
          },
          {
            日期: "1月3号",
            成本: 2123,
            利润: 90
          },
          {
            日期: "1月4号",
            成本: 4123,
            利润: 12
          },
          {
            日期: "1月5号",
            成本: 3123,
            利润: 15
          },
          {
            日期: "1月6号",
            成本: 7123,
            利润: 20
          }
        ]
      },
      pieChartSettings: {
        dimension: "成本",
        metrics: "利润"
      },
      ringChartData: {
        columns: ["日期", "成本", "利润"],
        rows: [
          {
            日期: "1月1号",
            成本: 123,
            利润: 3
          },
          {
            日期: "1月2号",
            成本: 1223,
            利润: 6
          },
          {
            日期: "1月3号",
            成本: 2123,
            利润: 90
          },
          {
            日期: "1月4号",
            成本: 4123,
            利润: 12
          },
          {
            日期: "1月5号",
            成本: 3123,
            利润: 15
          },
          {
            日期: "1月6号",
            成本: 7123,
            利润: 20
          }
        ]
      },
      ringChartSettings: {
        dimension: "成本",
        metrics: "利润"
      }
    };
  },
  created: function() {},
  methods: {},
  mounted() {
      let para={};

    getRequestApiinfoByWeek(para).then(res => {
      this.histogramChartDataWeek.columns = res.data.response.columns;
      this.histogramChartDataWeek.rows =JSON.parse( res.data.response.rows);
    });
    getAccessApiByDate(para).then(res => {
      this.lineChartData7Day = res.data.response;
    });
    getAccessApiByHour(para).then(res => {
      this.lineChartData24Hour = res.data.response;
    });
  }
};
</script>

<style scoped>
.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  padding: 10px 10px;
  font-size: 22px;
  color: #1f2f3d;
}
</style>
