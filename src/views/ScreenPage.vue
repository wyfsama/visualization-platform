<template>
  <div class="screen-container" :style="backgroundColor">
    <header class="screen-header" :style="titleColor">
      <div>WYFSAMA</div>
      <span class="logo"></span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <div class="theme iconfont icon-zhuti" @click="changeTheme"></div>
        <div class="datetime">{{datetime}}</div>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="fullScreenStatus.trend? 'fullscreen': ''">
          <i :class="['iconfont', fullScreenStatus.trend?'icon-icon--3':'icon-icon--2']" @click="changeScreen('trend')" :style="titleColor"></i>
          <Trend ref="trend"></Trend>
        </div>
        <div id="left-bottom" :class="fullScreenStatus.seller? 'fullscreen': ''">
           <Seller ref="seller"></Seller>
           <i :class="['iconfont', fullScreenStatus.seller?'icon-icon--3':'icon-icon--2']" @click="changeScreen('seller')" :style="titleColor"></i>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="fullScreenStatus.map? 'fullscreen': ''">
          <Map ref="map"></Map>
          <i :class="['iconfont', fullScreenStatus.map?'icon-icon--3':'icon-icon--2']" @click="changeScreen('map')" :style="titleColor"></i>
        </div>
        <div id="middle-bottom" :class="fullScreenStatus.rank? 'fullscreen': ''">
          <Rank ref="rank"></Rank>
          <i :class="['iconfont', fullScreenStatus.rank?'icon-icon--3':'icon-icon--2']" @click="changeScreen('rank')" :style="titleColor"></i>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="fullScreenStatus.hot? 'fullscreen': ''">
          <Hot ref="hot"></Hot>
          <i :class="['iconfont', fullScreenStatus.hot?'icon-icon--3':'icon-icon--2']" @click="changeScreen('hot')" :style="titleColor"></i>
        </div>
        <div id="right-bottom" :class="fullScreenStatus.stock? 'fullscreen': ''">
          <Stock ref="stock"></Stock>
          <i :class="['iconfont', fullScreenStatus.stock?'icon-icon--3':'icon-icon--2']" @click="changeScreen('stock')" :style="titleColor"></i>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
import { timeFormat } from '@/utils/time_utils'
import { mapMutations, mapState } from 'vuex'
import { getThemeColor } from '@/utils/theme_utils'
export default {
  data () {
    return {
      datetime: null,
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  mounted () {
    this.countTime()
  },
  methods: {
    changeScreen (item) {
      this.fullScreenStatus[item] = !this.fullScreenStatus[item]
      // console.log(this.$refs[item])
      this.$nextTick(() => {
        this.$refs[item].screenAdapter()
      })
    },
    countTime () {
      setInterval(() => { this.datetime = timeFormat(new Date()) }, 1000)
    },
    ...mapMutations(['changeTheme'])
  },
  computed: {
    ...mapState(['theme']),
    titleColor () {
      return {
        color: getThemeColor(this.theme).titleColor
      }
    },
    backgroundColor () {
      return {
        backgroundColor: getThemeColor(this.theme).backgroundColor
      }
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  }
}
</script>

<style lang="less" scoped>
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
i {
    position: absolute;
    z-index: 5;
    top: 20px;
    right: 20px;
    cursor: pointer;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
      img {
        width: 100%;
      }
    }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    // height: 64px;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .theme {
    width: 28px;
    font-size: 1.5rem;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  // position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
</style>
