import { mountQuasar } from '@test'
import Station from './Station'

const trailId = 'testTrailId'
const stationId = 'testStationId'

const trail = {
  name: 'testTrail',
  graph: {
    nodes: {
      [stationId]: {
        name: 'testStation'
      }
    }
  }
}

const station = {
  rows: [
    {
      type: 'text',
      rawHtml: 'testText'
    },
    {
      type: 'image',
      url: 'testSrc'
    }
  ]
}

const $route = {
  params: {
    trailId,
    stationId
  }
}

const store = {
  modules: {
    user: {
      namespaced: true,
      actions: {
        saveStationAccess: jest.fn()
      }
    },
    trails: {
      namespaced: true,
      getters: {
        getStation: () => () => station,
        getTrail: () => () => trail
      }
    }
  }
}
const wrapper = mountQuasar(Station, {
  store,
  mocks: {
    $route
  }
})

describe('Station', () => {
  it('saves access for this station for this user on the server', () => {
    expect(store.modules.user.actions.saveStationAccess).toHaveBeenCalled()
  })

  it('displays a "StationRenderer"', () => {
    const renderer = wrapper.find('.StationRenderer_test')
    expect(renderer.exists()).toBe(true)
  })
})
