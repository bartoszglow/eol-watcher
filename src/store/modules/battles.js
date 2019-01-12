import battles from '../../api/battles'

// initial state
const state = {
  all: []
}

// getters
const getters = {}

// actions
const actions = {
  getAllBattles ({ commit }) {
    battles.fetch(battles => {
      commit('setBattles', battles)
    })
  }
}

// mutations
const mutations = {
  setBattles (state, battles) {
    if(state.all.length < 10) {
      state.all.push(battles[state.all.length])
    } else {
      state.all = battles
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}