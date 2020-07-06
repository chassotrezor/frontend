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
    nodes: {},
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
  TODO: delete station subcollection as well
  needs to use cloud functions
  https://firebase.google.com/docs/firestore/solutions/delete-collections
*/
export function deleteTrail (__, trailId) {
  const trailRef = firebase.firestore().collection('trails').doc(trailId)
  return trailRef.delete()
}

const stationsListener = {}

export function bindStations ({ commit }, { trailId }) {
  const db = firebase.firestore()
  const stationsRef = db.collection('trails').doc(trailId).collection('stations')
  stationsListener[trailId] = stationsRef.onSnapshot(querySnapshot => {
    querySnapshot.forEach(snapshot => {
      commit('setStation', {
        trailId,
        stationId: snapshot.id,
        station: snapshot.data()
      })
    })
  })
}

export function unbindStations ({ commit }, { trailId }) {
  if (stationsListener[trailId]) {
    stationsListener[trailId]()
    delete stationsListener[trailId]
    commit('deleteStations', { trailId })
  }
}

const defaultStationScheme = stationId => {
  return {
    id: stationId,
    name: ''
  }
}

const isInDefaultStationScheme = key => {
  return Object.keys(defaultStationScheme('')).some(schemeKey => key === schemeKey)
}

const defaultStation = stationId => {
  return {
    id: stationId,
    name: '',
    isTrailEntry: false,
    rows: []
  }
}

export function createStation (__, { trailId }) {
  return new Promise((resolve) => {
    const db = firebase.firestore()
    const trailRef = db.collection('trails').doc(trailId)
    const stationRef = trailRef.collection('stations').doc()
    const stationId = stationRef.id
    db.runTransaction(async t => {
      const actualNodes = (await trailRef.get()).data().nodes
      const nodes = {
        ...actualNodes,
        [stationId]: defaultStationScheme(stationId)
      }
      await trailRef.update({ nodes })
      await stationRef.set(defaultStation(stationId))
      resolve(stationId)
    })
  })
}

export function updateStationInTrail (__, { trailId, stationId, newProps }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const stationRef = trailRef.collection('stations').doc(stationId)
  const newPropsForNodes = Object.entries(newProps).reduce((schemeProps, newProp) => {
    if (isInDefaultStationScheme(newProp[0])) schemeProps[newProp[0]] = newProp[1]
    return schemeProps
  }, {})
  return db.runTransaction(async t => {
    const oldNodes = (await trailRef.get()).data().nodes
    const nodes = {
      ...oldNodes,
      [stationId]: {
        ...oldNodes[stationId],
        ...newPropsForNodes
      }
    }
    await trailRef.update({ nodes })
    await stationRef.update(newProps)
  })
}

export function deleteStationInTrail (__, { trailId, stationId }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const stationRef = trailRef.collection('stations').doc(stationId)
  return db.runTransaction(async t => {
    const nodes = (await trailRef.get()).data().nodes
    delete nodes[stationId]
    await trailRef.update({ nodes })
    await stationRef.delete()
  })
}
