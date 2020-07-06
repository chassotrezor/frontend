import firebase from 'firebase/app'

let myTrailsListener

export function bindMyTrails ({ commit }) {
  const userId = firebase.auth().currentUser.uid
  const trailsRef = firebase.firestore().collection('trails')
  myTrailsListener = trailsRef.where('editor', '==', userId).onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      const id = change.doc.id
      if (change.type === 'removed') {
        commit('deleteTrail', id)
      } else {
        const trail = {
          ...change.doc.data(),
          id
        }
        commit('setTrail', trail)
      }
    })
  })
}

export function unbindMyTrails ({ commit }) {
  myTrailsListener()
  commit('deleteTrails')
}

const defaultTrail = userId => {
  return {
    trailScheme: {},
    editor: userId,
    name: ''
  }
}

export function createTrail () {
  return new Promise((resolve) => {
    const userId = firebase.auth().currentUser.uid
    const trailRef = firebase.firestore().collection('trails').doc()
    trailRef.set(defaultTrail(userId))
      .then(() => resolve(trailRef.id))
      .catch(error => console.log(error))
  })
}

export function updateTrail (__, { trailId, newProps }) {
  const trailRef = firebase.firestore().collection('trails').doc(trailId)
  trailRef.update(newProps)
}

/*
  TODO: delete clue subcollection as well
  needs to use cloud functions
  https://firebase.google.com/docs/firestore/solutions/delete-collections
*/
export function deleteTrail (__, trailId) {
  const trailRef = firebase.firestore().collection('trails').doc(trailId)
  return trailRef.delete()
}

const cluesListener = {}

export function bindClues ({ commit }, { trailId }) {
  const db = firebase.firestore()
  const cluesRef = db.collection('trails').doc(trailId).collection('clues')
  cluesListener[trailId] = cluesRef.onSnapshot(querySnapshot => {
    querySnapshot.forEach(snapshot => {
      commit('setClue', {
        trailId,
        clueId: snapshot.id,
        clue: snapshot.data()
      })
    })
  })
}

export function unbindClues ({ commit }, { trailId }) {
  if (cluesListener[trailId]) {
    cluesListener[trailId]()
    delete cluesListener[trailId]
    commit('deleteClues', { trailId })
  }
}

const defaultClueScheme = clueId => {
  return {
    id: clueId,
    name: ''
  }
}

const isInDefaultClueScheme = key => {
  return Object.keys(defaultClueScheme('')).some(schemeKey => key === schemeKey)
}

const defaultClue = clueId => {
  return {
    id: clueId,
    name: '',
    isTrailEntry: false,
    rows: []
  }
}

export function createClue (__, { trailId }) {
  return new Promise((resolve) => {
    const db = firebase.firestore()
    const trailRef = db.collection('trails').doc(trailId)
    const clueRef = trailRef.collection('clues').doc()
    const clueId = clueRef.id
    db.runTransaction(async t => {
      const actualTrailScheme = (await trailRef.get()).data().trailScheme
      const trailScheme = {
        ...actualTrailScheme,
        [clueId]: defaultClueScheme(clueId)
      }
      await trailRef.update({ trailScheme })
      await clueRef.set(defaultClue(clueId))
      resolve(clueId)
    })
  })
}

export function updateClueInTrail (__, { trailId, clueId, newProps }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const clueRef = trailRef.collection('clues').doc(clueId)
  const newPropsForTrailScheme = Object.entries(newProps).reduce((schemeProps, newProp) => {
    if (isInDefaultClueScheme(newProp[0])) schemeProps[newProp[0]] = newProp[1]
    return schemeProps
  }, {})
  return db.runTransaction(async t => {
    const oldTrailScheme = (await trailRef.get()).data().trailScheme
    const trailScheme = {
      ...oldTrailScheme,
      [clueId]: {
        ...oldTrailScheme[clueId],
        ...newPropsForTrailScheme
      }
    }
    await trailRef.update({ trailScheme })
    await clueRef.update(newProps)
  })
}

export function deleteClueInTrail (__, { trailId, clueId }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const clueRef = trailRef.collection('clues').doc(clueId)
  return db.runTransaction(async t => {
    const trailScheme = (await trailRef.get()).data().trailScheme
    delete trailScheme[clueId]
    await trailRef.update({ trailScheme })
    await clueRef.delete()
  })
}
