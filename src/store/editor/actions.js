import firebase from 'firebase/app'

let myChasesListener

export function bindMyChases ({ commit }) {
  const userId = firebase.auth().currentUser.uid
  const chasesRef = firebase.firestore().collection('chases')
  myChasesListener = chasesRef.where('editors', 'array-contains', userId).onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      const id = change.doc.id
      if (change.type === 'removed') {
        commit('deleteChase', id)
      } else {
        const chase = {
          ...change.doc.data(),
          id
        }
        commit('setChase', chase)
      }
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

/*
  TODO: delete clue subcollection as well
  needs to use cloud functions
  https://firebase.google.com/docs/firestore/solutions/delete-collections
*/
export function deleteChase (__, chaseId) {
  const chaseRef = firebase.firestore().collection('chases').doc(chaseId)
  return chaseRef.delete()
}

const defaultClueScheme = clueId => {
  return {
    id: clueId,
    name: ''
  }
}

const defaultClue = clueId => {
  return {
    id: clueId,
    name: '',
    isChaseEntry: false,
    rows: []
  }
}

export function createClue (__, { chaseId }) {
  return new Promise((resolve) => {
    // const userId = firebase.auth().currentUser.uid
    const db = firebase.firestore()
    const chaseRef = db.collection('chases').doc(chaseId)
    const clueRef = chaseRef.collection('clues').doc()
    const clueId = clueRef.id
    db.runTransaction(async t => {
      const actualChaseScheme = (await chaseRef.get()).data().chaseScheme
      const chaseScheme = {
        ...actualChaseScheme,
        [clueId]: defaultClueScheme(clueId)
      }
      await chaseRef.update({ chaseScheme })
      await clueRef.set(defaultClue(clueId))
      resolve(clueId)
    })
  })
}
