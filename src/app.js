import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'

Vue.use(VueRouter)

import Welcome from './components/Welcome.vue'
import Queue from './components/Queue.vue'
import store from './store'

const router = new VueRouter({
  routes: [
    { path: '/', component: Welcome },
    { path: '/queue', component: Queue },
  ]
})

setInterval(() => {
  store.dispatch('battles/getAllBattles')
}, 5000)

const app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
