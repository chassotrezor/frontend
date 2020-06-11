import firebase from 'firebase/app'

const defaultUser = {
  openChases: [],
  accessibleClues: {}
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

let unbind = () => {}
export function bindUser ({ commit }) {
  const currentUser = firebase.auth().currentUser
  if (currentUser) {
    const userId = currentUser.uid
    const userRef = getUserRef(userId)
    unbind = userRef.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        commit('setUser', docSnapshot.data())
      }
    })
  }
}
export function unbindUser ({ commit }) {
  unbind()
  unbind = () => {}
  commit('delUser', {})
}
