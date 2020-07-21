import { mountQuasar } from '@test'
import StationsList from './StationsList'
import { fromGeopoint } from 'src/helpers/mapHelpers'

const defaultAccessibleStations = {
  testTrailId1: {
    stations: {
      testStationId11: {
        name: 'test station name 11',
        position: { Rc: 1, Ac: 1 }
      },
      testStationId12: {
        name: 'test station name 12',
        position: { Rc: 1, Ac: 2 }
      }
    },
    data: {
      name: 'test trail name 1',
      color: '#000001',
      display: true
    }
  },
  testTrailId2: {
    stations: {
      testStationId21: {
        name: 'test station name 21',
        position: { Rc: 2, Ac: 1 }
      }
    },
    data: {
      name: 'test trail name 2',
      color: '#000002',
      display: true
    }
  },
  testTrailId3: {
    stations: {
      testStationId21: {
        name: 'test station name 21',
        position: { Rc: 3, Ac: 1 }
      }
    },
    data: {
      name: 'test trail name 2',
      color: '#000003',
      display: false
    }
  }
}

const expectedLength = Object.values(defaultAccessibleStations).reduce((amount, trail) => {
  if (trail.data.display) return amount + Object.keys(trail.stations).length
  else return amount
}, 0)

const defaultLastTrail = 'testTrailId1'

const store = {
  modules: {
    user: {
      namespaced: true,
      getters: {
        accessibleStations: state => state.accessibleStations,
        lastTrail: state => state.lastTrail
      },
      mutations: {
        setAccessibleStations: (state, value) => { state.accessibleStations = value },
        setLastTrail: (state, value) => { state.lastTrail = value }
      },
      state: () => {
        return {
          accessibleStations: defaultAccessibleStations,
          lastTrail: defaultLastTrail
        }
      }
    }
  }
}

const $router = {
  push: jest.fn()
}

describe('StationsList', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountQuasar(StationsList, {
      store
    })
    await wrapper.vm.$nextTick()
  })

  it('lists all the stations of displayed trails in an array combining trail and station data', () => {
    const trails = Object.entries(defaultAccessibleStations)
    const expectedStations = []
    trails.forEach(trail => {
      if (trail[1].data.display) {
        Object.entries(trail[1].stations).forEach(station => {
          expectedStations.push({
            trailId: trail[0],
            trailName: trail[1].data.name,
            stationId: station[0],
            stationName: station[1].name,
            latLng: fromGeopoint(station[1].position).toLatLng(),
            color: trail[1].data.color
          })
        })
      }
    })
    const stations = wrapper.vm.stations
    expect(stations).toEqual(expectedStations)
  })

  it('displays one "StationsListMarker" for each station in displayed trails', () => {
    const markers = wrapper.findAll('.StationsListMarker_test')
    expect(markers.length).toBe(expectedLength)
  })
})
