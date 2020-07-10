import Vue from 'vue'

export function setTrail (state, { trailId, trail }) {
  if (!state.trails[trailId]) {
    Vue.set(state.trails, trailId, {})
  }
  Object.entries(trail).forEach(entry => {
    Vue.set(state.trails[trailId], entry[0], entry[1])
  })
}

export function setStation (state, { trailId, stationId, station }) {
  if (!state.trails[trailId]) {
    Vue.set(state.trails, trailId, {})
  }
  Vue.set(state.trails[trailId], stationId, station)
}
