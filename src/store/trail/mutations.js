import Vue from 'vue'

export function setClue (state, { trailId, clueId, clue }) {
  if (!state.trails[trailId]) {
    Vue.set(state.trails, trailId, {})
  }
  Vue.set(state.trails[trailId], clueId, clue)
}
