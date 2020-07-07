import { mountQuasar } from '@test'
import TrailGraph from './TrailGraph'
import types from 'src/types'

const trailId = 'testTrailId'

const trail = {
  nodes: {
    testNodeId1: {
      name: 'testStationName1',
      type: types.nodes.STATION,
      dependencies: []
    },
    testNodeId2: {
      name: 'testStationName2',
      type: types.nodes.STATION,
      dependencies: ['testNodeId3']
    },
    testNodeId3: {
      name: 'testStationName3',
      type: types.nodes.STATION,
      dependencies: ['testNodeId1']
    }
  },
  endNodes: ['testNodeId2']
}

const expectedNodeIdsInOrder = [
  'testNodeId1',
  'testNodeId3',
  'testNodeId2'
]

const newStationId = 'newStationId'
const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getTrail: () => () => trail
      },
      actions: {
        createStation: jest.fn().mockResolvedValue(newStationId),
        deleteNodeInTrail: jest.fn()
      }
    }
  }
}

describe('TrailGraph', () => {
  let wrapper
  beforeAll(done => {
    wrapper = mountQuasar(TrailGraph, {
      store,
      propsData: {
        trailId
      }
    })
    wrapper.vm.$nextTick(done)
  })

  describe('NodeCards', () => {
    let nodeCards
    beforeAll(() => {
      nodeCards = wrapper.findAll('.NodeCard_test')
    })

    it('displays a "NodeCard" component for each node in trail', () => {
      expect(nodeCards.length).toBe(Object.keys(trail.nodes).length)
    })

    test('"NodeCards" are displayed as a list, according to dependencies', () => {
      const nodeIdsInOrder = []
      for (let i = 0; i < nodeCards.length; i++) {
        nodeIdsInOrder.push(nodeCards.at(i).props().node.nodeId)
      }
      expect(nodeIdsInOrder).toEqual(expectedNodeIdsInOrder)
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
