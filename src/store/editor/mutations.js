import Vue from 'vue'

export function setChase (state, chase) {
  Vue.set(state.myChases, chase.id, chase)
}
