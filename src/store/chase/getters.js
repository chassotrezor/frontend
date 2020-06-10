export function getClue (state) {
  return ({ chaseId, clueId }) => {
    if (!state.chases[chaseId] || !state.chases[chaseId][clueId]) {
      return undefined
    } else {
      return state.chases[chaseId][clueId]
    }
  }
}
