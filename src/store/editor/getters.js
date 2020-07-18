export function myTrails (state) {
  return state.myTrails
}

export function getTrail (state) {
  return ({ trailId }) => state.myTrails[trailId]
}

export function getStation (state) {
  return ({ trailId, stationId }) => {
    if (
      !state.myTrails[trailId] ||
      !state.myTrails[trailId].stations
    ) {
      return undefined
    } else {
      return state.myTrails[trailId].stations[stationId]
    }
  }
}

export function routeGuard (state) {
  return state.routeGuard
}
