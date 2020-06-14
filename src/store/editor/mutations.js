import Vue from 'vue'

export function setChase (state, chase) {
  Vue.set(state.myChases, chase.id, chase)
}

export function deleteChases (state) {
  Vue.set(state, 'myChases', {})
}
