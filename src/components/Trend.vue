<template>
  <div class="com-container">
    <div class="title" :style="[fontStyle,titleColor]">
      <div class="title-box"  @click="showChoice = !showChoice">
        <span>{{'▎   '+showTitle}}</span>
        <i class="iconfont icon-xiangxia" :style="fontStyle"></i>
      </div>
      <div class="selected">
        <div class="selectItem" @click="confirmType(i.key)" v-show="showChoice" v-for="i in selectType" :key="i.key">{{ i.text }}</div>
      </div>
    </div>
    <div @click="showChoice = false" class="com-chart" ref="trend_ref">Trend</div>
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
      showChoice: false,
      choiceType: 'map',
      titleFontsize: 0
    }
  },
  watch: {
    theme () {
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },
  computed: {
    selectType () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item =>
          item.key !== this.choiceType
        )
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    fontStyle () {
      return {
        fontSize: this.titleFontsize / 1.5 + 'px'
      }
    },
    ...mapState(['theme']),
    titleColor () {
      return {
        color: getThemeColor(this.theme).titleColor
      }
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          top: '25%',
          right: '5%',
          left: '5%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          icon: 'circle',
          top: '15%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      const { data: res } = await this.$http.get('trend')
      // console.log(JSON.stringify(res, null, 2))
      this.allData = res
      this.updateChart()
    },
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      const monthData = this.allData.common.month
      const seriesItem = this.allData[this.choiceType].data.map((item, index) => {
        return {
          type: 'line',
          stack: this.choiceType,
          name: item.name,
          data: item.data,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          },
          emphasis: {
            focus: 'series'
          }
        }
      })
      // console.log(seriesItem)
      const dataOption = {
        xAxis: {
          data: monthData
        },
        legend: {
          data: this.allData[this.choiceType].data.map(item => item.name)
        },
        series: seriesItem
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontsize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemGap: this.titleFontsize / 2,
          itemWidth: this.titleFontsize / 2,
          itemHeight: this.titleFontsize / 2,
          textStyle: {
            fontSize: this.titleFontsize / 1.5
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    confirmType (key) {
      this.choiceType = key
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  z-index: 10;
  color: #fff;
  top: 20px;
  left: 20px;
  user-select: none;
  i {
    margin: 5px;
    cursor: pointer;
  }
  .selected{
    margin-left: 1em;
  }
}
</style>
