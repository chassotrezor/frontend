import firebase from 'firebase/app'

function getTrailRef (trailId) {
  return firebase.firestore().collection('trails').doc(trailId)
}

function getStationRef (trailId, stationId) {
  return getTrailRef(trailId).collection('stations').doc(stationId)
}

// TODO: change promise to async function if possible
export function downloadStation ({ commit }, { trailId, stationId }) {
  return new Promise((resolve, reject) => {
    const stationRef = getStationRef(trailId, stationId)
    stationRef.get()
      .then(doc => {
        commit('setStation', { trailId, stationId, station: doc.data() })
        resolve()
      })
      .catch(error => {
        console.log(error)
      })
  })
}

export async function start (__, { trailId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const openTrails = [...doc.data().openTrails, trailId]
      t.update(userRef, { openTrails })
    })
    console.log('Transaction success!')
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}

export async function saveStationAccess (__, { trailId, stationId }) {
  const db = firebase.firestore()
  const userId = firebase.auth().currentUser.uid
  const userRef = db.collection('users').doc(userId)
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef)
      const trailIsOpen = doc.data().openTrails.some(id => id === trailId)
      const currentAccessibleStations = doc.data().accessibleStations
      if (trailIsOpen) {
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
      }
    })
    console.log('Transaction success!')
  } catch (err) {
    console.log('Transaction failure:', err)
  }
}
