import firebase from 'firebase/app'

function getTrailRef (trailId) {
  return firebase.firestore().collection('trails').doc(trailId)
}

function getStationRef (trailId, stationId) {
  return getTrailRef(trailId).collection('stations').doc(stationId)
}

export async function downloadTrail ({ commit }, { trailId }) {
  const trailRef = getTrailRef(trailId)
  const doc = await trailRef.get()
  if (doc.data()) {
    commit('setTrail', { trailId, trail: doc.data() })
  } else {
    throw new Error('trail does not exist')
  }
}

export async function downloadStation ({ commit }, { trailId, stationId }) {
  const stationRef = getStationRef(trailId, stationId)
  const doc = await stationRef.get()
  if (doc.data()) {
    commit('setStation', { trailId, stationId, station: doc.data() })
  } else {
    throw new Error('station does not exist')
  }
}
