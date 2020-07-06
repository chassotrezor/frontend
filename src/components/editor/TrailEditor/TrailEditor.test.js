import { mountQuasar } from '@test'
import TrailEditor from './TrailEditor'

const trailId = 'testTrailId'

const trail = {
  trailScheme: {
    testStationId1: {
      id: 'testStationId1',
      name: 'testStationName1'
    },
    testStationId2: {
      id: 'testStationId2',
      name: 'testStationName2'
    }
  },
  name: 'testTrailName'
}

const $route = {
  params: {}
}

const $router = {
  push: route => {
    $route.params = { ...route.params }
  }
}

const newStationId = 'newStationId'
const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail,
        getStation: state => () => state.stationId
      },
      actions: {
        updateTrail: jest.fn(),
        createStation: jest.fn().mockResolvedValue(newStationId),
        bindStations: jest.fn(),
        unbindStations: jest.fn()
      },
      mutations: {
        setTrail: (state, trailId) => {
          state.trailId = trailId
        },
        setStation: (state, stationId) => {
          state.stationId = stationId
        }
      },
      state: () => {
        return {
          trailId: undefined,
          stationId: undefined
        }
      }
    }
  }
}

describe('TrailEditor', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(TrailEditor, {
      store,
      propsData: {
        trailId
      },
      mocks: {
        $route,
        $router
      }
    })
    wrapper.vm.$nextTick(done)
  })

  it('displays an "update" button', () => {
    const btn = wrapper.find('.UpdateBtn_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "update" button emits "click"', () => {
    beforeAll(done => {
      wrapper.vm.name = 'newName'
      const btn = wrapper.find('.UpdateBtn_test')
      btn.vm.$emit('click')
      wrapper.vm.$nextTick(done)
    })

    it('updates the name of this trail on server', () => {
      expect(store.modules.editor.actions.updateTrail).toHaveBeenCalledWith(
        expect.any(Object),
        {
          trailId,
          newProps: {
            name: 'newName'
          }
        }
      )
    })
  })

  it('displays a "StationCard" component for each station in trail', () => {
    const stations = wrapper.findAll('.StationCard_test')
    expect(stations.length).toBe(Object.keys(trail.trailScheme).length)
  })

  it('displays no "StationEditor" component', () => {
    const stationEditor = wrapper.find('.StationEditor_test')
    expect(stationEditor.exists()).toBe(false)
  })

  describe('when one "StationCard" component emits "edit" with value "stationId"', () => {
    let stationId
    beforeAll(done => {
      const station = wrapper.find('.StationCard_test')
      stationId = station.props().station.id
      station.vm.$emit('edit', stationId)
      wrapper.vm.$nextTick(done)
    })

    it('emits "editStation" event with value "stationId"', () => {
      expect(wrapper.emitted('editStation')[0][0]).toBe(stationId)
    })
  })

  it('displays a "create station" button', () => {
    const btn = wrapper.find('.CreateStation_test')
    expect(btn.exists()).toBe(true)
  })

  describe('when "create station" button emits "click"', () => {
    beforeAll(async () => {
      const btn = wrapper.find('.CreateStation_test')
      btn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('creates a new station for this trail on server', () => {
      expect(store.modules.editor.actions.createStation).toHaveBeenCalledWith(
        expect.any(Object),
        { trailId }
      )
    })

    it('emits "editStation" with "newStationId" value', () => {
      expect(wrapper.emitted('editStation')[1][0]).toBe(newStationId)
    })
  })
})
