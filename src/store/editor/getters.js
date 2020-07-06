export function myTrails (state) {
  return state.myTrails
}

export function getTrail (state) {
  return ({ trailId }) => state.myTrails[trailId]
}

export function getClue (state) {
  return ({ trailId, clueId }) => {
    if (
      !state.myTrails[trailId] ||
      !state.myTrails[trailId].clues
    ) {
      return undefined
    } else {
      return state.myTrails[trailId].clues[clueId]
    }
  }
}
