export function myChases (state) {
  return state.myChases
}

export function getChase (state) {
  return ({ chaseId }) => state.myChases[chaseId]
}

export function getClue (state) {
  return ({ chaseId, clueId }) => {
    if (
      !state.myChases[chaseId] ||
      !state.myChases[chaseId].clues
    ) {
      return undefined
    } else {
      return state.myChases[chaseId].clues[clueId]
    }
  }
}
