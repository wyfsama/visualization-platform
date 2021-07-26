<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref">111</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timeID: null
    }
  },
  mounted () {
    // console.log(this.$el)
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timeID)
    window.removeEventListener('resize', this.screenAdapter)
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
    // 初始化
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '18%',
          right: '6%',
          bottom: '5%',
          left: '2%',
          containLabel: true
        },
        xAxis: {
          axisLine: { show: true }, // 显示坐标轴
          axisTick: { show: true }, //  显示刻度
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          // show: true,
          trigger: 'axis',
          axisPointer: {
            z: 0,
            lineStyle: {
              type: 'solid',
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right'
            },
            itemStyle: {
              //  渐变色表示方法1
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => clearInterval(this.timeID))
      this.chartInstance.on('mouseout', () => this.startInterval())
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('seller')
      this.allData = res
      this.allData.sort((a, b) => a.value - b.value)
      // 每五个元素一页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()
      this.startInterval()
    },
    // 更新视图
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerName = showData.map(item => item.name)
      const sellerValues = showData.map(item => item.value)
      const dataOption = {
        yAxis: {
          data: sellerName
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 轮播效果
    startInterval () {
      if (this.timeID) {
        clearInterval(this.timeID)
      }
      this.timeID = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 窗口大小变化完成适配
    screenAdapter () {
      const titleFontsize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontsize / 1.3
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontsize
            }
          }
        },
        series: [
          {
            barWidth: titleFontsize,
            itemStyle: {
              borderRadius: [0, titleFontsize / 2, titleFontsize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
