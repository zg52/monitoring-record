<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '250px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    },
    chartTitle: {
      type: String,
      required: true
    },
    chartDataArr: {
      type: Array,
      required: true
    },
    chartHoverValue: {
      type: String,
      required: true
    },
    chartType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val, this.chartTitle, this.chartDataArr, this.chartHoverValue)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData, this.chartTitle, this.chartDataArr, this.chartHoverValue)
    },
    setOptions(chartData, chartTitle, chartDataArr, chartHoverValue) {
      this.chart.setOption({
        title: {
					text: chartTitle,
					left: 'center',
					top: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          // padding: [5, 10]
        },
        grid: {
          top: '10%',
          left: '2%',
          right: '2%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartDataArr,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        // yAxis: {
        //   axisTick: {
        //     show: false
        //   }
        // },
        yAxis: [{
          type: 'value',
          axisLabel:{formatter:'{value}s'},
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: chartHoverValue, 
          itemStyle: {
            normal: {
              // color: this.chartType == '1' ? '#24ccb8' : '#ffc760',
              lineStyle: {
                color: this.chartType == '1' ? '#24ccb8' : '#ffc760',
                width: 2 
              }
            }
          },
          areaStyle: {
            color: this.chartType == '1' ? '#24ccb817' : '#ffc76017'
          },
          smooth: true,
          type: 'line',
          data: chartData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },]
      })
    }
  }
}
</script>