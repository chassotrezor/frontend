import firebase from 'firebase/app'

const defaultUser = {
  openedChases: []
}

function getUserRef (userId) {
  return firebase.firestore().collection('users').doc(userId)
}

export function initUser (__, { userId }) {
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(userId)

  return db.runTransaction(async t => {
    const doc = await t.get(userRef)
    if (!doc.exists) {
      t.set(userRef, defaultUser)
    }
  })
}

export function downloadUser ({ commit }, { userId }) {
  return new Promise((resolve, reject) => {
    const userRef = getUserRef(userId)
    userRef.get()
      .then(doc => {
        commit('setUser', doc.data())
        resolve()
      })
      .catch(error => {
        console.log(error)
      })
  })
}
