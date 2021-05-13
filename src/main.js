import Vue from 'vue/dist/vue.common.js'
import App from './App.vue'
  import Vexcel from '../dist/v-excel.js'
  Vue.use(Vexcel)

new Vue({
  el: '#app',
  render: h => h(App)
})
