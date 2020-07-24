import firebase from 'firebase/app'
import { defaultTrail, defaultStation, defaultNode } from 'src/store/defaultData'
import { generateNodeId } from 'src/helpers/graphHelpers'
import types from 'src/types'

// Images handlers

async function removeImages (storedImagesGraph) {
  const userId = firebase.auth().currentUser.uid
  await Promise.all(Object.entries(storedImagesGraph).map(async trail => {
    const trailId = trail[0]
    await Promise.all(Object.entries(trail[1]).map(async station => {
      const stationId = station[0]
      await Promise.all(station[1].map(fileId => {
        const path = `${userId}/${trailId}/${stationId}/${fileId}`
        const ref = firebase.storage().ref().child(path)
        return ref.delete()
      }))
    }))
  }))
}

async function getStationStoredImagesArray (stationRef, transaction) {
  const stationStoredImagesArray = []
  const rows = (await transaction.get(stationRef)).data().rows
  rows.map(row => {
    if (row.type === types.rows.IMAGE && row.data.fileId !== null) {
      stationStoredImagesArray.push(row.data.fileId)
    }
  })
  return stationStoredImagesArray
}

// trail handlers

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

export async function createTrail (__, { position }) {
  const userId = firebase.auth().currentUser.uid
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc()
  const stationId = generateNodeId()
  const stationRef = trailRef.collection('stations').doc(stationId)
  await db.runTransaction(async t => {
    t.set(trailRef, defaultTrail(userId, stationId, position))
    t.set(stationRef, defaultStation(stationId))
  })
  return trailRef.id
}

export function updateTrail (__, { trailId, newProps }) {
  const trailRef = firebase.firestore().collection('trails').doc(trailId)
  return trailRef.update(newProps)
}

export async function deleteTrail (__, { trailId }) {
  const db = firebase.firestore()
  const storedImagesGraph = {
    [trailId]: {}
  }
  await db.runTransaction(async transaction => {
    const trailRef = db.collection('trails').doc(trailId)
    const nodes = (await transaction.get(trailRef)).data().graph.nodes
    const stationsIds = Object.keys(nodes)
    await Promise.all(stationsIds.map(async stationId => {
      const stationRef = trailRef.collection('stations').doc(stationId)
      const stationStoredImagesArray = await getStationStoredImagesArray(stationRef, transaction)
      if (stationStoredImagesArray.length > 0) storedImagesGraph[trailId][stationId] = stationStoredImagesArray
      transaction.delete(stationRef)
    }))
    transaction.delete(trailRef)
  })
  return removeImages(storedImagesGraph)
}

// stations handlers

const stationsListener = {}

function isNodeProp (key) {
  return Object.keys(defaultNode([0, 0])).some(nodeKey => key === nodeKey)
}

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

export function createStation (__, { trailId, stationId }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const stationRef = trailRef.collection('stations').doc(stationId)
  return db.runTransaction(async t => {
    t.set(stationRef, defaultStation(stationId))
  })
}

export async function updateStationInTrail ({ getters }, { trailId, stationId, newProps }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const stationRef = trailRef.collection('stations').doc(stationId)
  const newPropsForNodes = Object.entries(newProps).reduce((nodeProps, newProp) => {
    if (isNodeProp(newProp[0])) nodeProps[newProp[0]] = newProp[1]
    return nodeProps
  }, {})

  await db.runTransaction(async t => {
    const oldGraph = (await t.get(trailRef)).data().graph
    const graph = {
      ...oldGraph,
      nodes: {
        ...oldGraph.nodes,
        [stationId]: {
          ...oldGraph.nodes[stationId],
          ...newPropsForNodes
        }
      }
    }
    t.update(trailRef, { graph })
    t.update(stationRef, newProps)
  })

  const imageRows = newProps.rows.filter(row => row.type === types.rows.IMAGE)
  const imageRowsWithoutFileId = imageRows.filter(row => !row.data.fileId)
  const imageFilesToDelete = imageRowsWithoutFileId.reduce((fileIds, row) => {
    const oldRow = getters.getStation({ trailId, stationId }).rows.find(r => r.rowId === row.rowId)
    if (oldRow && oldRow.data.fileId) fileIds.push(oldRow.data.fileId)
    return fileIds
  }, [])
  if (imageFilesToDelete.length > 0) {
    const storedImagesGraph = {
      [trailId]: {
        [stationId]: imageFilesToDelete
      }
    }
    await removeImages(storedImagesGraph)
  }
}

export async function removeStationInTrail (__, { trailId, removedStationId, updatedGraph }) {
  if (Object.keys(updatedGraph.nodes).length > 1) {
    const db = firebase.firestore()
    const trailRef = db.collection('trails').doc(trailId)
    const stationRef = trailRef.collection('stations').doc(removedStationId)
    const storedImagesGraph = {
      [trailId]: {}
    }
    await db.runTransaction(async transaction => {
      const stationStoredImagesArray = await getStationStoredImagesArray(stationRef, transaction)
      if (stationStoredImagesArray.length > 0) storedImagesGraph[trailId][removedStationId] = stationStoredImagesArray
      transaction.update(trailRef, { graph: updatedGraph })
      transaction.delete(stationRef)
    })
    return removeImages(storedImagesGraph)
  }
}

// old function (may be useful)

// export function removeStationInTrail (__, { trailId, nodeId }) {
//   const db = firebase.firestore()
//   const trailRef = db.collection('trails').doc(trailId)
//   return db.runTransaction(async t => {
//     const trail = (await t.get(trailRef)).data()
//     if (trail.nodes[nodeId].type === types.nodes.STATION) {
//       const stationRef = trailRef.collection('stations').doc(nodeId)
//       t.delete(stationRef)
//     }
//     const isTrailEntry = trail.trailEntries[0] === nodeId
//     const isEndNode = trail.endNodes[0] === nodeId
//     const nodeDependencies = trail.nodes[nodeId].dependencies
//     Object.entries(trail.nodes).forEach(node => {
//       if (node[1].dependencies[0] === nodeId) {
//         node[1].dependencies = nodeDependencies
//         if (isTrailEntry) trail.trailEntries = node[0]
//       }
//     })
//     if (isEndNode) trail.endNodes = nodeDependencies
//     delete trail.nodes[nodeId]
//     t.update(trailRef, { ...trail })
//   })
// }

export function delegateRouteGuard ({ commit }, { action, next }) {
  commit('setRouteGuard', { action, next })
}
