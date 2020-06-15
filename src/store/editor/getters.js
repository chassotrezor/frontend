export function myChases (state) {
  return Object.values(state.myChases)
}

export function getChase (state) {
  return ({ chaseId }) => state.myChases[chaseId]
}

export function getClue (state) {
  return ({ chaseId, clueId }) => true
}
