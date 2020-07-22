import { mountQuasar } from '@test'
import Station from './Station'

jest.mock('firebase/app', () => {
  return {
    auth: () => {
      return {
        currentUser: null
      }
    }
  }
})

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

const $q = {
  notify: jest.fn()
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
    $route,
    $q
  }
})

describe('Station', () => {
  it('notifies user for connection if user is not connected', () => {
    expect($q.notify).toHaveBeenCalled()
  })

  it('saves access for this station for this user on the server', () => {
    expect(store.modules.user.actions.saveStationAccess).toHaveBeenCalled()
  })

  it('displays a "StationRenderer"', () => {
    const renderer = wrapper.find('.StationRenderer_test')
    expect(renderer.exists()).toBe(true)
  })

  /*
    TODO: make this test work without setTimeout
    there might be a way to wait for the mock to be done, or to chain methods
  */

  it('does not notify user for connection if user is connected', () => {
    jest
      .clearAllMocks()
      .mock('firebase/app', () => {
        return {
          auth: () => {
            return {
              currentUser: { uid: 'exists' }
            }
          }
        }
      })
    setTimeout(() => {
      mountQuasar(Station, {
        store,
        mocks: {
          $route,
          $q
        }
      })
      expect($q.notify).not.toHaveBeenCalled()
    }, 0)
  })
})
