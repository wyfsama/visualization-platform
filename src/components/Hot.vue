<template>
  <div class="com-container">
    <div class="com-chart" ref="hotproduct_ref">hotproduct</div>
    <i class="iconfont icon-icon_zuo left" @click="pre" :style="[iconSize, cursorStateLeft?{cursor:'pointer'}:'',titleColor]"></i>
    <i class="iconfont icon-icon_zuo right" @click="next" :style="[iconSize, cursorStateRight?{cursor:'pointer'}:'',titleColor]"></i>
    <div class="categary" :style="[showTitleStyle,titleColor]">{{showTitle}}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeColor } from '@/utils/theme_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: null,
      cursorStateLeft: false,
      cursorStateRight: true
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  computed: {
    ...mapState(['theme']),
    showTitle () {
      if (!this.allData) {
        return ''
      }
      return this.allData[this.currentIndex].name
    },
    iconSize () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    showTitleStyle () {
      return {
        fontSize: this.titleFontSize / 2 + 'px'
      }
    },
    titleColor () {
      return {
        color: getThemeColor(this.theme).titleColor
      }
    }
  },
  watch: {
    currentIndex (val) {
      if (val === 2) {
        this.cursorStateRight = false
      } else {
        this.cursorStateRight = true
      }
      if (val === 0) {
        this.cursorStateLeft = false
      } else {
        this.cursorStateLeft = true
      }
    },
    theme () {
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hotproduct_ref, this.theme)
      const initOption = {
        title: {
          text: '▎热销商品占比',
          top: 20,
          left: 20
        },
        series: {
          type: 'pie',
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              color: {}
            },
            labelLine: {
              show: false
            }
          }
        },
        legend: {
          top: '15%',
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const { data: res } = await this.$http.get('hotproduct')
      this.allData = res
      console.log(this.allData)
      this.updateChart()
    },
    updateChart () {
      const showCategory = this.allData[this.currentIndex]
      // console.log(showCategory)
      const seriesArr = showCategory.children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      // console.log(seriesArr)
      const updateOption = {
        name: showCategory.name,
        series: {
          data: seriesArr
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const children = arg.data.children
            const total = children.reduce((pre, cur) => {
              return pre + cur.value
            }, 0)
            return children.reduce((pre, cur) => {
              return pre + `${cur.name}:${(cur.value / total * 100).toFixed(2)}%` + '<br/>'
            }, '')
          }
        }
      }
      this.chartInstance.setOption(updateOption)
    },
    pre () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = 0
      }
      this.updateChart()
    },
    next () {
      this.currentIndex++
      this.cursorState = true
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = this.allData.length - 1
        // this.cursorStateRight = false
      }
      this.updateChart()
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.hotproduct_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize / 1.5
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 1.5
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%'],
            emphasis: {
              label: {
                fontSize: this.titleFontSize / 1.5
              }
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
  .left{
    position: absolute;
    top: 50%;
    left: 5%;
    color: #fff;
    transform: rotate(180deg);
    // cursor: pointer;
  }
  .right{
    position: absolute;
    top: 50%;
    right: 5%;
    // transform: rotate(180deg);
    color: #fff
  }
  .categary{
    position: absolute;
    bottom: 20px;
    right: 20px;
    color: #fff;
    // cursor: pointer;
  }
</style>
