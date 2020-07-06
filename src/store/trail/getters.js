export function getStation (state) {
  return ({ trailId, stationId }) => {
    if (!state.trails[trailId] || !state.trails[trailId][stationId]) {
      return undefined
    } else {
      return state.trails[trailId][stationId]
    }
  }
}
