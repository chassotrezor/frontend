import firebase from 'firebase/app'
import { defaultTrail, defaultNode, defaultStation } from 'src/store/defaultData'
import types from 'src/types'

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
        [stationId]: {
          ...defaultNode,
          type: types.nodes.STATION
        }
      }
      await trailRef.update({ nodes })
      await stationRef.set(defaultStation(stationId))
      resolve(stationId)
    })
  })
}

const isNodeProp = key => {
  return Object.keys(defaultNode).some(nodeKey => key === nodeKey)
}

export function updateStationInTrail (__, { trailId, stationId, newProps }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const stationRef = trailRef.collection('stations').doc(stationId)
  const newPropsForNodes = Object.entries(newProps).reduce((nodeProps, newProp) => {
    if (isNodeProp(newProp[0])) nodeProps[newProp[0]] = newProp[1]
    return nodeProps
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

export function deleteNodeInTrail (__, { trailId, nodeId }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  return db.runTransaction(async t => {
    const nodes = (await trailRef.get()).data().nodes
    if (nodes[nodeId].type === types.nodes.STATION) {
      const stationRef = trailRef.collection('stations').doc(nodeId)
      await stationRef.delete()
    }
    // TODO: remove dependancies pointing to deleted station
    delete nodes[nodeId]
    await trailRef.update({ nodes })
  })
}
