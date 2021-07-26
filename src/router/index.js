import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '@/views/ScreenPage'
import TrendPage from '@/views/TrendPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  }, {
    path: '/screen',
    component: ScreenPage
  }, {
    path: '/td',
    component: TrendPage
  }
]

const router = new VueRouter({
  routes
})

export default router
