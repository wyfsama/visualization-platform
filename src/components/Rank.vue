<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref">rank</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,
      timeID: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '▎地区销售排行',
          top: 20,
          left: 20
        },
        tooltip: {
          trigger: 'axis',
          show: true
        },
        grid: {
          top: '22%',
          right: '6%',
          bottom: '3%',
          left: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          axisLine: { show: true }, // 显示坐标轴
          axisTick: { show: true }, //  显示刻度
          type: 'value'
        },
        series: [{
          type: 'bar'
        }]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timeID)
      })
    },
    async getData () {
      const { data: res } = await this.$http.get('/rank')
      // console.log(res)
      this.allData = res
      this.allData.sort((a, b) => b.value - a.value)
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const xaxisArr = this.allData.map(item => item.name)
      const yaxisArr = this.allData.map(item => item.value)
      const dataOption = {
        xAxis: {
          data: xaxisArr
        },
        dataZoom: [{
          show: false,
          startValue: this.startValue,
          endValue: this.startValue + 9
        }],
        series: [{
          data: yaxisArr,
          itemStyle: {
            color: arg => {
              let colorRange = null
              if (arg.data > 300) {
                colorRange = colorArr[0]
              } else if (arg.data > 200) {
                colorRange = colorArr[1]
              } else {
                colorRange = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colorRange[0]
                },
                {
                  offset: 1,
                  color: colorRange[1]
                }
              ])
            }
          }
        }]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize / 2.3
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeID = setInterval(() => {
        this.startValue++
        const end = this.startValue + 9
        if (end > this.allData.length - 1) {
          this.startValue = 0
        }
        this.updateChart()
      }, 2000)
    }
  }
}
</script>

<style>

</style>
