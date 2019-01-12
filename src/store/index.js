import Vue from 'vue'
import Vuex from 'vuex'
import battles from './modules/battles'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    battles
  },
  strict: debug
})
