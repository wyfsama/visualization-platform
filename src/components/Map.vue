<template>
  <div class="com-container" @dblclick="back">
    <div class="com-chart" ref="map_ref">1111</div>
  </div>
</template>

<script>
// import Map from '../../public/static/map/china.json'
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      provData: {},
      initOption: null,
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  computed: {
    ...mapState(['theme']),
  },
  watch: {
    theme() {
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    },
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      const map = await axios.get('/static/map/china.json', {
        baseURL: '',
      })
      console.log(map)
      // console.log(map.data)
      this.$echarts.registerMap('china', map.data)
      this.initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20,
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical',
          icon: 'roundRect',
        },
        geo: [
          {
            map: 'china',
            roam: false,
            // zlevel: 2,
            itemStyle: {
              areaColor: '#08407D',
              borderColor: '#0A609D',
              borderType: 'dashed',
              borderWidth: 1.5,
            },
            label: {
              show: true,
              color: '#fff',
            },
          },
        ],
      }
      this.chartInstance.setOption(this.initOption)
      this.chartInstance.on('click', async (e) => {
        const provCname = e.name
        const { key, path } = getProvinceMapInfo(provCname)
        const provMap = await axios.get('http://localhost:2222' + path)
        console.log(provMap.data)
        this.provData[key] = provMap.data
        this.$echarts.registerMap(key, provMap.data)
        const changeOption = {
          ...this.initOption,
          geo: {
            type: 'map',
            // geoIndex: 0,
            map: key,
          },
          series: [
            {
              animation: false,
            },
          ],
        }
        // this.chartInstance.clear()
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData() {
      const res = await this.$http.get('map')
      this.allData = res.data
      // console.log(this.allData)
      this.updateChart()
    },
    updateChart() {
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          zlevel: 1,
          // geoIndex: 0,
          clip: true,
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke',
          },
        }
      })
      const legendArr = this.allData.map((item) => item.name)
      const dataOption = {
        series: seriesArr,
        legend: {
          legendArr,
        },
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontsize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontsize / 2.3,
          },
        },
        legend: {
          itemWidth: titleFontsize / 2,
          itemHeight: titleFontsize / 4,
          itemGap: titleFontsize / 4,
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    back() {
      const revertOption = {
        geo: {
          map: 'china',
        },
      }
      this.chartInstance.setOption(revertOption)
    },
  },
}
</script>

<style>
</style>
