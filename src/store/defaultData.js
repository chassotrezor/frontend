export const defaultTrail = (userId, firstStationId, position) => {
  return {
    graph: {
      nodes: {
        [firstStationId]: {
          dependencies: [],
          type: 'STATION',
          name: 'Start',
          position: position.geopoint
        }
      },
      endNodes: [firstStationId],
      trailEntries: [firstStationId]
    },
    editor: userId,
    name: 'New Trail',
    position
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
