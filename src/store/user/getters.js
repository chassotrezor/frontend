export function openTrails (state) {
  if (state.accessibleStations) return Object.keys(state.accessibleStations)
  else return []
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
