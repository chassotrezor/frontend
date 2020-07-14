import firebase from 'firebase/app'

export const defaultTrail = (userId, firstStationId) => {
  return {
    nodes: {
      [firstStationId]: {
        dependencies: [],
        type: 'STATION',
        name: 'Start',
        position: new firebase.firestore.GeoPoint(0, 0)
      }
    },
    editor: userId,
    name: '',
    endNodes: [firstStationId],
    trailEntries: [firstStationId],
    // TODO: generate position with geofirex
    position: {
      geohash: '7zzzzzzzz',
      geopoint: { Rc: 0, Ac: 0 }
    }
  }
}

export const defaultNode = position => {
  return {
    dependencies: [],
    type: 'STATION',
    name: 'new station',
    position
  }
}

export const defaultStation = stationId => {
  return {
    id: stationId,
    rows: []
  }
}

export const defaultUser = {
  accessibleStations: {},
  lastTrail: '',
  lastStation: ''
}
