import { ipcRenderer } from 'electron'
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
    battles.fetch(battles => commit('setBattles', battles))
  }
}

// mutations
const mutations = {
  setBattles (state, fetchedBattles) {
    const oldBattlesIds = state.all.map(battle => battle.index)
    const oldBattles = fetchedBattles.filter(battle => oldBattlesIds.indexOf(battle.index) > -1)
    const newBattles = fetchedBattles.filter(battle => oldBattlesIds.indexOf(battle.index) === -1)
    const startedBattles = oldBattles.filter(battle => {
      const stateBattle = state.all[oldBattlesIds.indexOf(battle.index)]
      return stateBattle.inqueue !== battle.inqueue
    })

    if(state.all.length < 10) {
      state.all.push(fetchedBattles[state.all.length])
    } else {
      [...newBattles, ...startedBattles].forEach(battle => ipcRenderer.send('battle', battle))

      state.all = fetchedBattles
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
