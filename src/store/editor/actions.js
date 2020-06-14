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

export function createChase () {
  return new Promise(resolve => {
    console.log('CREATE')
    resolve()
  })
}
