import Vue from 'vue'
import App from './App.vue'
import VueElectron from 'vue-electron'

Vue.use(VueElectron)
Vue.config.productionTip = false
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)
new Vue({
  render: h => h(App),
}).$mount('#app')
