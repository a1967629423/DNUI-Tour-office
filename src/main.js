import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import routes from './router';

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router: routes,
  render: h => h(App)
})
