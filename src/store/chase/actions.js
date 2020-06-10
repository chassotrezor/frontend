import firebase from 'firebase/app'

function getChaseRef (chaseId) {
  return firebase.firestore().collection('chases').doc(chaseId)
}

function getClueRef (chaseId, clueId) {
  return getChaseRef(chaseId).collection('clues').doc(clueId)
}

// TODO: change promise to async function if possible
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

export async function start (__, { chaseId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const openedChases = [...doc.data().openedChases, chaseId]
      t.update(userRef, { openedChases })
    })
    console.log('Transaction success!')
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}
