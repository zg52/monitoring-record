<!--
 * @Author: your name
 * @Date: 2021-08-25 10:46:43
 * @LastEditTime: 2021-08-30 18:50:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \workspace\hjimi2\bayonet-monitoring-front-demo\src\views\dashboard\index.vue
-->
<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <el-row :gutter="30" class="dashboard-card-box">
      <el-col :span="8">
        <div class="grid-content">
          <div class="title">今日访问人数</div>
          <div class="number">{{ todayVisits }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <div class="title">平均停留时长</div>
          <div class="number">{{ averageLengthOfStay }}秒</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <div class="title">当前人数</div>
          <div class="number">{{ currentNumber }}</div>
        </div>
      </el-col>
    </el-row>
    <div class="dashboard-select-box">
      <el-select v-model="typeValue" placeholder="请选择统计方式">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="dateValue"
        type="date"
        placeholder="选择日期"
        @change="timeChange"
      >
      </el-date-picker>
    </div>
    <div class="dashboard-chart-box">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="14">
          <div class="left-box">
            <el-row :gutter="32">
              <el-col :xs="24" :sm="24" :lg="24">
                <div class="chart-wrapper">
                  <bar-chart
                    :height="visitsHeight"
                    :bar-data="visitsRecord"
                    :bar-title="visitsTitle"
                    :bar-data-arr="visitsDataArr"
                    :bar-hover-value="visitsHoverValue"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="32" style="margin-top: 20px">
              <el-col :xs="24" :sm="24" :lg="24">
                <div class="chart-wrapper">
                  <line-chart
                    chart-type="1"
                    :chart-data="averageRecord"
                    :chart-title="averageTitle"
                    :chart-data-arr="averageDataArr"
                    :chart-hover-value="averageHoverValue"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="32" style="margin-top: 20px">
              <el-col :xs="24" :sm="24" :lg="24">
                <div class="chart-wrapper">
                  <line-chart
                    chart-type="2"
                    :chart-data="totalRecord"
                    :chart-title="totalTitle"
                    :chart-data-arr="totalDataArr"
                    :chart-hover-value="totalHoverValue"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="10" style="padding: 130px 0 100px 0">
          <div class="right-box">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :lg="24">
                <div class="chart-wrapper">
                  <pie-chart
                    :pie-data="sexRecord"
                    :pie-title="sexTitle"
                    :pie-data-arr="sexDataArr"
                  />
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 100px">
              <el-col :xs="24" :sm="24" :lg="24">
                <div class="chart-wrapper">
                  <pie-chart
                    :pie-data="ageRecord"
                    :pie-title="ageTitle"
                    :pie-data-arr="ageDataArr"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";
import { getHomeInfo, getHomeRefresh } from "@/api/dashboard";

export default {
  name: "Dashboard",
  data() {
    return {
      todayVisits: 0,
      averageLengthOfStay: 0,
      currentNumber: 0,
      options: [
        {
          value: "0",
          label: "按小时统计",
        },
      ],
      typeValue: "0",
      dateValue: new Date().getTime(),
      visitsHeight: "250px",
      visitsRecord: [],
      visitsTitle: "访问人数",
      visitsDataArr: [],
      visitsHoverValue: "访问人数",
      averageRecord: [],
      averageTitle: "平均停留时长",
      averageDataArr: [],
      averageHoverValue: "平均留时长/S",
      totalRecord: [],
      totalTitle: "总停留时长",
      totalDataArr: [],
      totalHoverValue: "总停留时长/S",
      sexRecord: [],
      sexTitle: "性别分布",
      sexDataArr: [],
      ageRecord: [],
      ageTitle: "年龄分布",
      ageDataArr: [],
    };
  },
  components: {
    BarChart,
    PieChart,
    LineChart,
  },
  computed: {
    ...mapGetters(["name"]),
  },
  methods: {
    async timeChange(x) {
      if (x) {
        console.log(x);
        this.dateValue = new Date(x).getTime();
        await this.fetchData();
      }
    },
    clearData() {
      this.visitsRecord = [];
      this.visitsDataArr = [];
      this.averageRecord = [];
      this.averageDataArr = [];
      this.totalRecord = [];
      this.totalDataArr = [];
      this.sexRecord = [];
      this.sexDataArr = [];
      this.ageRecord = [];
      this.ageDataArr = [];
    },
    fetchData() {
      const { typeValue, dateValue } = this;
      this.clearData();
      getHomeInfo({
        type: typeValue,
        startTime: dateValue,
        endTime: dateValue,
      })
        .then((response) => {
          const {
            todayVisits,
            averageLengthOfStay,
            currentNumber,
            visitorsPerHour,
            averageLengthOfStayPerHour,
            theTotalStayTimePerHour,
            genderRatio,
            ageSegmentRatio,
          } = response.data;
          this.todayVisits = todayVisits;
          this.averageLengthOfStay = averageLengthOfStay;
          this.currentNumber = currentNumber;
          for (let k in visitorsPerHour) {
            this.visitsDataArr.push(`${k}点`);
            this.visitsRecord.push(visitorsPerHour[k]);
          }
          for (let k in averageLengthOfStayPerHour) {
            this.averageDataArr.push(`${k}点`);
            this.averageRecord.push(averageLengthOfStayPerHour[k]);
          }
          for (let k in theTotalStayTimePerHour) {
            this.totalDataArr.push(`${k}点`);
            this.totalRecord.push(theTotalStayTimePerHour[k]);
          }
          for (let k in genderRatio) {
            let newKey = "";
            if (k == "male") {
              newKey = "男";
            } else if (k == "female") {
              newKey = "女";
            } else {
              newKey = "未知";
            }
            this.sexDataArr.push(newKey);
            this.sexRecord.push({
              value: genderRatio[k],
              name: newKey,
            });
          }
          for (let k in ageSegmentRatio) {
            this.ageDataArr.push(k);
            this.ageRecord.push({
              value: ageSegmentRatio[k],
              name: k,
            });
          }
        })
        .catch((error) => {
          // 做些什么吧
        });
    },
    fetchRefreshData() {
      getHomeRefresh()
        .then((response) => {
          const {
            todayVisits,
            averageLengthOfStay,
            currentNumber,
          } = response.data;
          this.todayVisits = todayVisits;
          this.averageLengthOfStay = averageLengthOfStay;
          this.currentNumber = currentNumber;
        })
        .catch((error) => {
          // 做些什么吧
        });
    },
  },
  created() {
    this.fetchData();
  },
  beforeDestroy() {
    this.$EventBus.$off("go");
  },
  mounted() {
    this.$EventBus.$on("go", async () => {
      this.fetchRefreshData();
    });
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px 80px;
  }
  &-card-box {
    .el-col {
      .grid-content {
        height: 120px;
        background: #f8f9fb;
        border-radius: 5px;
        overflow: hidden;
        .title {
          font-family: SourceHanSansCN-Medium;
          height: 16px;
          font-size: 16px;
          line-height: 16px;
          letter-spacing: 0px;
          color: #74798c;
          text-align: center;
          margin-top: 20px;
        }
        .number {
          height: 37px;
          font-family: SourceHanSansCN-Medium;
          font-size: 37px;
          line-height: 37px;
          text-align: center;
          color: #282d30;
          margin-top: 23px;
        }
      }
    }
  }
  &-select-box {
    padding-top: 20px;
    .el-select {
      margin-right: 27px;
    }
  }
  &-chart-box {
    padding-top: 35px;
  }
}
</style>
