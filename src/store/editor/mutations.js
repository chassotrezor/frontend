import Vue from 'vue'

export function setTrail (state, trail) {
  if (!state.myTrails[trail.id] || !state.myTrails[trail.id].stations) {
    Vue.set(state.myTrails, trail.id, { ...trail, stations: {} })
  } else {
    const stations = state.myTrails[trail.id].stations
    Vue.set(state.myTrails, trail.id, { ...trail, stations })
  }
}

export function deleteTrail (state, trailId) {
  Vue.delete(state.myTrails, trailId)
}

export function deleteTrails (state) {
  Vue.set(state, 'myTrails', {})
}

export function setStation (state, { trailId, stationId, station }) {
  if (!state.myTrails[trailId]) {
    Vue.set(state.myTrails, trailId, {})
  }
  if (!state.myTrails[trailId].stations) {
    Vue.set(state.myTrails[trailId], 'stations', {})
  }
  Vue.set(state.myTrails[trailId].stations, stationId, station)
}

export function deleteStations (state, { trailId }) {
  Vue.delete(state.myTrails[trailId], 'stations')
}

export function setRouteGuard (state, { action, next }) {
  state.routeGuard = { action, next }
}
