import Vue from 'vue'

export function setChase (state, chase) {
  Vue.set(state.myChases, chase.id, chase)
}

export function deleteChase (state, chaseId) {
  Vue.delete(state.myChases, chaseId)
}

export function deleteChases (state) {
  Vue.set(state, 'myChases', {})
}
