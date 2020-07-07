import { mountQuasar } from '@test'
import TrailEditor from './TrailEditor'
import types from 'src/types'

const trailId = 'testTrailId'

const trail = {
  nodes: {
    testnodeId1: {
      name: 'testStationName1',
      type: types.nodes.STATION
    },
    testNodeId2: {
      name: 'testStationName2',
      type: types.nodes.STATION
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
        unbindStations: jest.fn(),
        deleteNodeInTrail: jest.fn()
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

  describe('NodeCards', () => {
    let nodeCards
    beforeAll(() => {
      nodeCards = wrapper.findAll('.NodeCard_test')
    })

    it('displays a "NodeCard" component for each node in trail', () => {
      expect(nodeCards.length).toBe(Object.keys(trail.nodes).length)
    })

    describe('when one "NodeCard" component emits "editStation"', () => {
      beforeAll(async () => {
        const nodeCard = nodeCards.at(0)
        nodeCard.vm.$emit('editStation')
        await wrapper.vm.$nextTick()
      })

      it('emits "editStation" event with value "stationId"', () => {
        const stationId = Object.keys(trail.nodes)[0]
        expect(wrapper.emitted('editStation')[0][0]).toBe(stationId)
      })
    })

    describe('when one "NodeCard" component emits "remove"', () => {
      beforeAll(async () => {
        const nodeCard = nodeCards.at(0)
        nodeCard.vm.$emit('remove')
        await wrapper.vm.$nextTick()
      })

      it('it deletes corresponding node in correspondig trail on server', () => {
        const nodeId = Object.keys(trail.nodes)[0]
        expect(store.modules.editor.actions.deleteNodeInTrail).toHaveBeenCalledWith(
          expect.any(Object),
          {
            trailId,
            nodeId
          }
        )
      })
    })
  })

  it('displays no "StationEditor" component', () => {
    const stationEditor = wrapper.find('.StationEditor_test')
    expect(stationEditor.exists()).toBe(false)
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
