<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref">stock</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
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
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      timeID: null
    }
  },
  async created () {
    const { data: res } = await this.$http.get('stock')
    this.allData = res
    this.updateChart()
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.startInterval()
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme)
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
        },
        tooltip: {
          trigger: 'item'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // async getData () {
    //   const { data: res } = await this.$http.get('stock')
    //   this.allData = res
    //   this.updateChart()
    // },
    updateChart () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false // 隐藏指示线
          },
          tooltip: {
            formatter: arg => {
              return `${arg.name}<br>占比：${arg.percent}%`
            }
          },
          data: [
            {
              value: item.sales,
              name: item.name,
              label: {
                show: true,
                position: 'center',
                color: colorArr[index][0],
                formatter: arg => {
                  const { data } = arg
                  return `${data.name}

销量：${data.value}`
                }
              },
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              name: '库存',
              value: item.stock,
              itemStyle: {
                color: '#333843'
              },
              label: {
                show: false
              }
            }
          ]
        }
      })
      const updateOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(updateOption)
    },
    startInterval () {
      if (this.timeID) {
        clearInterval(this.timeID)
      }
      this.timeID = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 2000)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2
      const outterRadius = innerRadius * 1.3
      const fillSeriesItem = {
        type: 'pie',
        radius: [innerRadius, outterRadius],
        label: {
          fontSize: titleFontSize / 1.8
        }
      }
      // const fillSeries = this.alldata ? new Array(this.alldata.length) : []
      const fillSeries = new Array(10)
      fillSeries.fill(fillSeriesItem)
      // console.log(fillSeries)
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize / 1.5
          }
        },
        series: fillSeries
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style>

</style>
