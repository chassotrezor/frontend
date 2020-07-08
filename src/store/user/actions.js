import firebase from 'firebase/app'

const defaultUser = {
  openTrails: [],
  accessibleStations: {},
  lastTrail: '',
  lastStation: ''
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

export async function saveStationAccess (__, { trailId, stationId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const currentAccessibleStations = doc.data().accessibleStations
      const update = {
        lastTrail: trailId,
        lastStation: stationId
      }
      // TODO: improve checks and case handling
      if (!currentAccessibleStations[trailId]) {
        const accessibleStations = {
          ...currentAccessibleStations,
          [trailId]: {
            data: {
              name: 'trail name' // TODO: handle trail data
            },
            stations: {
              [stationId]: {
                name: 'station name' // TODO: handle station data
              }
            }
          }
        }
        update.accessibleStations = accessibleStations
      } else {
        const currentStationIsNotAccessible =
          Object.keys(currentAccessibleStations[trailId].stations).every(id => id !== stationId)

        if (currentStationIsNotAccessible) {
          const accessibleStations = {
            ...currentAccessibleStations,
            [trailId]: {
              data: {
                name: 'trail name' // TODO: handle trail data
              },
              stations: {
                ...currentAccessibleStations[trailId].stations,
                [stationId]: {
                  name: 'station name' // TODO: handle station data
                }
              }
            }
          }
          update.accessibleStations = accessibleStations
        }
      }
      t.update(userRef, update)
    })
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}

export async function updateTrailAccess (__, { trailId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)
  const trailRef = db.collection('trails').doc(trailId)
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const accessibleStations = doc.data().accessibleStations
      const trail = await t.get(trailRef)
      const trailDoesNotExist = !trail.data()
      if (trailDoesNotExist) delete accessibleStations[trailId]
      else {
        let noStationExist = true
        await Promise.all(Object.keys(accessibleStations[trailId].stations).map(async stationId => {
          const stationRef = trailRef.collection('stations').doc(stationId)
          const station = await t.get(stationRef)
          const stationDoesNotExist = !station.data()
          noStationExist = noStationExist && stationDoesNotExist
          if (stationDoesNotExist) delete accessibleStations[trailId].stations[stationId]
        }))
        if (noStationExist) delete accessibleStations[trailId]
      }
      t.update(userRef, { accessibleStations })
    })
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}
