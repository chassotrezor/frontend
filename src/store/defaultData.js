export const defaultTrail = userId => {
  return {
    nodes: {},
    editor: userId,
    name: '',
    endNodes: []
  }
}

export const defaultNode = {
  dependencies: [],
  type: '',
  name: ''
}

export const defaultStation = stationId => {
  return {
    id: stationId,
    name: '',
    rows: []
  }
}

export const defaultUser = {
  accessibleStations: {},
  lastTrail: '',
  lastStation: ''
}