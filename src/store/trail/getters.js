export function getClue (state) {
  return ({ trailId, clueId }) => {
    if (!state.trails[trailId] || !state.trails[trailId][clueId]) {
      return undefined
    } else {
      return state.trails[trailId][clueId]
    }
  }
}
