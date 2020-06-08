import firebase from 'firebase/app'

function getChaseRef (chaseId) {
  return firebase.firestore().collection('chases').doc(chaseId)
}

function getClueRef (chaseId, clueId) {
  return getChaseRef(chaseId).collection('clues').doc(clueId)
}

export function downloadClue ({ commit }, { chaseId, clueId }) {
  return new Promise((resolve, reject) => {
    const clueRef = getClueRef(chaseId, clueId)
    clueRef.get()
      .then(doc => {
        commit('setClue', { chaseId, clueId, clue: doc.data() })
        resolve()
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export function start ({ commit }, { chaseId, clueId }) {

}
