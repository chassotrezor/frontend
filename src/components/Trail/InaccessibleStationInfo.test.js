import { mountQuasar } from '@test'
import InaccessibleStationInfo from './InaccessibleStationInfo'

const trail = {
  name: 'testTrail',
  position: {
    geopoint: {
      latitude: 31,
      longitude: 41
    }
  },
  graph: {
    nodes: {
      testStationId: {
        name: 'testStationName'
      }
    }
  }
}

const store = {
  modules: {
    trails: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail
      }
    }
  }
}

const $route = {
  params: {
    trailId: 'testTrailId',
    stationId: 'testStationId'
  }
}

describe('InaccessibleStationInfo', () => {
  const wrapper = mountQuasar(InaccessibleStationInfo, {
    store,
    mocks: { $route }
  })
  const map = wrapper.find('.BasicMap_test')
  const marker = wrapper.find('.TrailMarker_test')

  it('displays a "BasicMap"', () => {
    expect(map.exists()).toBeTruthy()
  })

  it('displays a "TrailMarker"', () => {
    expect(marker.exists()).toBeTruthy()
  })

  test('"BasicMap" is centered on "TrailMarker"', () => {
    expect(map.props().center).toEqual(marker.props().latLng)
  })
})
