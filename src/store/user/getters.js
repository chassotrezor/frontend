export function openTrails (state) {
  if (state.accessibleStations) return Object.keys(state.accessibleStations)
  else return []
}

export function accessibleStations (state) {
  return state.accessibleStations
}

export function sortedAccessibleTrails (state) {
  if (state.accessibleStations) {
    const sortedAccessibleTrails = Object.entries(state.accessibleStations).map(trail => {
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
  } else {
    return []
  }
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
