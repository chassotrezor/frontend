import Vue from 'vue'

export function setStation (state, { trailId, stationId, station }) {
  if (!state.trails[trailId]) {
    Vue.set(state.trails, trailId, {})
  }
  Vue.set(state.trails[trailId], stationId, station)
}
