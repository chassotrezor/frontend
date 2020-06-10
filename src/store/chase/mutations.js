import Vue from 'vue'

export function setClue (state, { chaseId, clueId, clue }) {
  if (!state.chases[chaseId]) {
    Vue.set(state.chases, chaseId, {})
  }
  Vue.set(state.chases[chaseId], clueId, clue)
}
