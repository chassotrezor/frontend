export function accessibleStations (state) {
  return state.accessibleStations || {}
}

export function openTrails (state) {
  return Object.keys(accessibleStations(state))
}

export function sortedAccessibleTrails (state) {
  const accStn = state.accessibleStations || {}
  const sortedAccessibleTrails = Object.entries(accStn).map(trail => {
    return {
      name: trail[1].data.name,
      trailId: trail[0],
      color: trail[1].data.color,
      display: trail[1].data.display
    }
  })
  sortedAccessibleTrails.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
  return sortedAccessibleTrails
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
