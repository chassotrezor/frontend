import firebase from 'firebase/app'
import { defaultUser } from 'src/store/defaultData'
import { merge } from 'lodash'

function getUserRef (userId) {
  return firebase.firestore().collection('users').doc(userId)
}

export function initUser (__, { userId }) {
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(userId)

  return db.runTransaction(async t => {
    const serverUserDoc = await t.get(userRef)
    const localUserString = localStorage.getItem('user')
    if (!serverUserDoc.exists && !localUserString) t.set(userRef, defaultUser)
    if (!serverUserDoc.exists && localUserString) t.set(userRef, JSON.parse(localUserString))
    if (serverUserDoc.exists && localUserString) {
      const serverUser = serverUserDoc.data()
      const localUser = JSON.parse(localUserString)
      const mergedUser = merge(serverUser, localUser)
      t.set(userRef, mergedUser)
    }
    localStorage.removeItem('user')
  })
}

let unbind = () => {}

function bindUserOnServer ({ commit, userId }) {
  const userRef = getUserRef(userId)
  unbind = userRef.onSnapshot(docSnapshot => {
    if (docSnapshot.exists) {
      commit('setUser', docSnapshot.data())
    }
  })
}

// TODO: find if it is possible to replace repeated calls with a listener
function bindUserLocally ({ commit, getters }) {
  const intervalId = setInterval(() => {
    const user = localStorage.getItem('user') || JSON.stringify(defaultUser)
    const stateUser = JSON.stringify(getters.user)
    if (user !== stateUser) commit('setUser', JSON.parse(user))
  }, 1000)
  unbind = () => clearInterval(intervalId)
}

export function bindUser ({ commit, getters }) {
  const currentUser = firebase.auth().currentUser
  if (currentUser) {
    const userId = currentUser.uid
    bindUserOnServer({ commit, userId })
  } else {
    bindUserLocally({ commit, getters })
  }
}
export function unbindUser ({ commit }) {
  unbind()
  unbind = () => {}
  commit('delUser')
}

async function saveStationAccessOnServer ({ trailId, stationId, userId }) {
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(userId)
  const trailRef = db.collection('trails').doc(trailId)
  try {
    await db.runTransaction(async (t) => {
      const user = await t.get(userRef)
      const trailDoc = await t.get(trailRef)
      const trail = trailDoc.data()
      const accessibleStations = user.data().accessibleStations
      const currentTrailIsNotAccessible = !accessibleStations[trailId]
      if (currentTrailIsNotAccessible) {
        accessibleStations[trailId] = {
          data: {
            name: trail.name
          },
          stations: {}
        }
      }

      const currentStationIsNotAccessible =
        Object.keys(accessibleStations[trailId].stations).every(id => id !== stationId)

      if (currentStationIsNotAccessible) {
        const station = trail.graph.nodes[stationId]
        accessibleStations[trailId].stations[stationId] = {
          name: station.name,
          position: station.position
        }
      }

      const update = {
        accessibleStations,
        lastTrail: trailId,
        lastStation: stationId
      }
      t.update(userRef, update)
    })
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}

async function saveStationAccessLocally ({ trailId, stationId }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const trail = await trailRef.get()
  const oldUser = localStorage.getItem('user') || JSON.stringify(defaultUser)
  const accessibleStations = JSON.parse(oldUser).accessibleStations
  const currentTrailIsNotAccessible = !accessibleStations[trailId]
  if (currentTrailIsNotAccessible) {
    accessibleStations[trailId] = {
      data: {
        name: trail.data().name
      },
      stations: {}
    }
  }

  const currentStationIsNotAccessible =
    Object.keys(accessibleStations[trailId].stations).every(id => id !== stationId)

  if (currentStationIsNotAccessible) {
    accessibleStations[trailId].stations[stationId] = {
      name: trail.data().graph.nodes[stationId].name
    }
  }

  const user = JSON.stringify({
    accessibleStations,
    lastTrail: trailId,
    lastStation: stationId
  })

  localStorage.setItem('user', user)
}

export async function saveStationAccess (__, { trailId, stationId }) {
  const currentUser = firebase.auth().currentUser
  if (currentUser) await saveStationAccessOnServer({ trailId, stationId, userId: currentUser.uid })
  else saveStationAccessLocally({ trailId, stationId })
}

async function getAccessibleStations ({ currentUser, transaction }) {
  if (currentUser) {
    const userRef = firebase.firestore().collection('users').doc(currentUser.uid)
    const doc = await transaction.get(userRef)
    return doc.data().accessibleStations
  } else {
    const user = localStorage.getItem('user') || JSON.stringify(defaultUser)
    return JSON.parse(user).accessibleStations
  }
}

async function updateAccessibleStations ({ accessibleStations, currentUser, transaction }) {
  if (currentUser) {
    const userRef = firebase.firestore().collection('users').doc(currentUser.uid)
    return transaction.update(userRef, { accessibleStations })
  } else {
    const oldUserString = localStorage.getItem('user') || JSON.stringify(defaultUser)
    const oldUser = JSON.parse(oldUserString)
    const user = {
      ...oldUser,
      accessibleStations
    }
    return localStorage.setItem('user', JSON.stringify(user))
  }
}

export async function updateTrailAccess (__, { trailId }) {
  const db = firebase.firestore()
  const trailRef = db.collection('trails').doc(trailId)
  const currentUser = firebase.auth().currentUser
  try {
    await db.runTransaction(async transaction => {
      const accessibleStations = await getAccessibleStations({ currentUser, transaction })
      const trail = await transaction.get(trailRef)
      const trailDoesNotExist = !trail.data()
      if (trailDoesNotExist) delete accessibleStations[trailId]
      else {
        let noStationExist = true
        await Promise.all(Object.keys(accessibleStations[trailId].stations).map(async stationId => {
          const stationRef = trailRef.collection('stations').doc(stationId)
          const station = await transaction.get(stationRef)
          const stationDoesNotExist = !station.data()
          noStationExist = noStationExist && stationDoesNotExist
          if (stationDoesNotExist) delete accessibleStations[trailId].stations[stationId]
        }))
        if (noStationExist) delete accessibleStations[trailId]
      }
      await updateAccessibleStations({ accessibleStations, currentUser, transaction })
    })
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}

export function toggleTrailDisplay (__, { trailId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)
  return db.runTransaction(async transaction => {
    const user = await transaction.get(userRef)
    const trail = user.data().accessibleStations[trailId]
    const accessibleStations = {
      [trailId]: {
        data: {
          display: !trail.data.display
        }
      }
    }
    transaction.set(userRef, { accessibleStations }, { merge: true })
  })
}

export function setTrailColor (__, { trailId, color }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)
  const accessibleStations = {
    [trailId]: {
      data: {
        color
      }
    }
  }
  userRef.set({ accessibleStations }, { merge: true })
}
