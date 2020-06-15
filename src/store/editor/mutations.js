import Vue from 'vue'

export function setChase (state, chase) {
  if (!state.myChases[chase.id] || !state.myChases[chase.id].clues) {
    Vue.set(state.myChases, chase.id, { ...chase, clues: {} })
  } else {
    const clues = state.myChases[chase.id].clues
    Vue.set(state.myChases, chase.id, { ...chase, clues })
  }
}

export function deleteChase (state, chaseId) {
  Vue.delete(state.myChases, chaseId)
}

export function deleteChases (state) {
  Vue.set(state, 'myChases', {})
}

export function setClue (state, { chaseId, clueId, clue }) {
  if (!state.myChases[chaseId]) {
    Vue.set(state.myChases, chaseId, {})
  }
  if (!state.myChases[chaseId].clues) {
    Vue.set(state.myChases[chaseId], 'clues', {})
  }
  Vue.set(state.myChases[chaseId].clues, clueId, clue)
}

export function deleteClues (state, { chaseId }) {
  Vue.delete(state.myChases[chaseId], 'clues')
}
