import firebase from 'firebase/app'

let myChasesListener

export function bindMyChases ({ commit }) {
  const userId = firebase.auth().currentUser.uid
  const chasesRef = firebase.firestore().collection('chases')
  myChasesListener = chasesRef.where('editors', 'array-contains', userId).onSnapshot(querySnapshot => {
    querySnapshot.forEach(documentSnaphot => {
      const chase = {
        ...documentSnaphot.data(),
        id: documentSnaphot.id
      }
      commit('setChase', chase)
    })
  })
}

export function unbindMyChases ({ commit }) {
  myChasesListener()
  commit('deleteChases')
}

const defaultChase = userId => {
  return {
    chaseScheme: {},
    editors: [userId],
    name: ''
  }
}

export function createChase () {
  return new Promise((resolve) => {
    const userId = firebase.auth().currentUser.uid
    const chaseRef = firebase.firestore().collection('chases').doc()
    chaseRef.set(defaultChase(userId))
      .then(() => resolve(chaseRef.id))
      .catch(error => console.log(error))
  })
}

export function updateChase (__, { chaseId, newProps }) {
  const chaseRef = firebase.firestore().collection('chases').doc(chaseId)
  chaseRef.update(newProps)
}

export function deleteChase (__, chaseId) {
  const chaseRef = firebase.firestore().collection('chases').doc(chaseId)
  return chaseRef.delete()
}
