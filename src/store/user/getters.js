export function openTrails (state) {
  return Object.keys(state.accessibleStations)
}

export function accessibleStations (state) {
  return state.accessibleStations
}

export function lastTrail (state) {
  return state.lastTrail
}

export function lastStation (state) {
  return state.lastStation
}

export function user (state) {
  return state
}
