import Vue from 'vue'

export function setTrail (state, trail) {
  if (!state.myTrails[trail.id] || !state.myTrails[trail.id].clues) {
    Vue.set(state.myTrails, trail.id, { ...trail, clues: {} })
  } else {
    const clues = state.myTrails[trail.id].clues
    Vue.set(state.myTrails, trail.id, { ...trail, clues })
  }
}

export function deleteTrail (state, trailId) {
  Vue.delete(state.myTrails, trailId)
}

export function deleteTrails (state) {
  Vue.set(state, 'myTrails', {})
}

export function setClue (state, { trailId, clueId, clue }) {
  if (!state.myTrails[trailId]) {
    Vue.set(state.myTrails, trailId, {})
  }
  if (!state.myTrails[trailId].clues) {
    Vue.set(state.myTrails[trailId], 'clues', {})
  }
  Vue.set(state.myTrails[trailId].clues, clueId, clue)
}

export function deleteClues (state, { trailId }) {
  Vue.delete(state.myTrails[trailId], 'clues')
}
