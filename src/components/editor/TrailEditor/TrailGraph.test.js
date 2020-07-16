import { mountQuasar } from '@test'
import TrailGraph from './TrailGraph'
import types from 'src/types'
import { remove, moveBefore, moveAfter, generateNodeBefore, generateNodeAfter } from './graphHelpers'
import PositionTranslator from 'src/mixins/PositionTranslator'

jest.mock('firebase/app', () => {
  return {
    firestore: {
      GeoPoint: array => {
        return { Ac: array[0], Rc: array[1] }
      }
    }
  }
})

const graph = {
  trailEntries: ['testNodeId1'],

  nodes: {
    testNodeId1: {
      name: 'testStationName1',
      type: types.nodes.STATION,
      dependencies: [],
      position: { Ac: 1, Rc: 1 }
    },
    testNodeId2: {
      name: 'testStationName2',
      type: types.nodes.STATION,
      dependencies: ['testNodeId1'],
      position: { Ac: 2, Rc: 2 }
    },
    testNodeId3: {
      name: 'testStationName3',
      type: types.nodes.STATION,
      dependencies: ['testNodeId2'],
      position: { Ac: 3, Rc: 3 }
    },
    testNodeId4: {
      name: 'testStationName4',
      type: types.nodes.STATION,
      dependencies: ['testNodeId3'],
      position: { Ac: 4, Rc: 4 }
    }
  },

  endNodes: ['testNodeId4']
}

const expectedNodeIdsInOrder = [
  'testNodeId1',
  'testNodeId2',
  'testNodeId3',
  'testNodeId4'
]

const expectedPositionsInOrder = expectedNodeIdsInOrder.map(nodeId => {
  return Object.values(graph.nodes[nodeId].position)
})

const nbNodes = expectedNodeIdsInOrder.length

const mount = () => {
  const wrapper = mountQuasar(TrailGraph, {
    propsData: {
      graph
    }
  })
  const nodeMarkers = wrapper.findAll('.NodeMarker_test')
  return { wrapper, nodeMarkers }
}

describe('TrailGraph', () => {
  describe('NodeMarkers', () => {
    it('displays a "NodeMarker" component for each node in trail', () => {
      const { nodeMarkers } = mount()
      expect(nodeMarkers.length).toBe(Object.keys(graph.nodes).length)
    })

    test('"NodeMarkers" are joined with a "LPolyline" following implicit trail order', () => {
      const { wrapper } = mount()
      const polyline = wrapper.find('.LPolyline_test')
      expect(polyline.props().latLngs).toEqual(expectedPositionsInOrder)
    })

    test('only first "NodeMarker" has prop "first" set to true', () => {
      const { nodeMarkers } = mount()
      for (let i = 0; i < nbNodes; i++) {
        expect(nodeMarkers.at(i).vm.first).toBe(i === 0)
      }
    })

    test('only last "NodeMarker" has prop "last" set to true', () => {
      const { nodeMarkers } = mount()
      for (let i = 0; i < nbNodes; i++) {
        expect(nodeMarkers.at(i).vm.last).toBe(i === nbNodes - 1)
      }
    })

    describe('when one "NodeMarker" component emits "update:lat-lng" with "newLatLng"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "updateGraph" with correct "newGraph"', async () => {
        const newLatLng = { lat: 10, lng: 10 }
        const nodeCard = nodeMarkers.at(0)
        nodeCard.vm.$emit('update:lat-lng', newLatLng)
        await wrapper.vm.$nextTick()
        const stationId = expectedNodeIdsInOrder[0]
        const expectedNewGraph = JSON.parse(JSON.stringify(graph))
        expectedNewGraph.nodes[stationId].position = PositionTranslator.methods.fromLatLng(newLatLng).toGeopoint()
        expect(wrapper.emitted('updateGraph')[0][0]).toEqual(expectedNewGraph)
      })
    })

    describe('when one "NodeMarker" component emits "updateName" with "newName"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "updateName" event with "{ stationId, newName }"', async () => {
        const newName = 'newName'
        const nodeCard = nodeMarkers.at(0)
        nodeCard.vm.$emit('updateName', newName)
        await wrapper.vm.$nextTick()
        const stationId = expectedNodeIdsInOrder[0]
        expect(wrapper.emitted('updateName')[0][0]).toEqual({ stationId, newName })
      })
    })

    describe('when one "NodeMarker" component emits "editStation"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "editStation" event with value "stationId"', async () => {
        const nodeCard = nodeMarkers.at(0)
        nodeCard.vm.$emit('editStation')
        await wrapper.vm.$nextTick()
        const stationId = expectedNodeIdsInOrder[0]
        expect(wrapper.emitted('editStation')[0][0]).toBe(stationId)
      })
    })

    describe('when one "NodeMarker" component emits "removeStation"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "removeStation" with "{ removedStationId, updatedGraph }"', async () => {
        for (let i = 0; i < nbNodes; i++) {
          const nodeCard = nodeMarkers.at(i)
          nodeCard.vm.$emit('removeStation')
          await wrapper.vm.$nextTick()
          const removedStationId = expectedNodeIdsInOrder[i]
          const updatedGraph = remove(removedStationId, graph)
          expect(wrapper.emitted('removeStation')[i][0]).toEqual({ removedStationId, updatedGraph })
        }
      })
    })

    describe('when one "NodeMarker" component emits "move:before"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "updateGraph" with correct "newGraph"', async () => {
        for (let i = 0; i < nbNodes; i++) {
          const nodeCard = nodeMarkers.at(i)
          nodeCard.vm.$emit('move:before')
          await wrapper.vm.$nextTick()
          const nodeId = expectedNodeIdsInOrder[i]
          const newGraph = moveBefore(nodeId, graph)
          expect(wrapper.emitted('updateGraph')[i][0]).toEqual(newGraph)
        }
      })
    })

    describe('when one "NodeMarker" component emits "move:after"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "updateGraph" with correct "newGraph"', async () => {
        for (let i = 0; i < nbNodes; i++) {
          const nodeCard = nodeMarkers.at(i)
          nodeCard.vm.$emit('move:after')
          await wrapper.vm.$nextTick()
          const nodeId = expectedNodeIdsInOrder[i]
          const newGraph = moveAfter(nodeId, graph)
          expect(wrapper.emitted('updateGraph')[i][0]).toEqual(newGraph)
        }
      })
    })

    describe('when one "NodeMarker" component emits "newStation:before"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "createStation" with "{ newGraph, newStationId }"', async () => {
        for (let i = 0; i < nbNodes; i++) {
          const nodeCard = nodeMarkers.at(i)
          nodeCard.vm.$emit('newStation:before')
          await wrapper.vm.$nextTick()
          const emittedNodes = wrapper.emitted('createStation')[i][0].newGraph.nodes
          const length = Object.keys(emittedNodes).length
          expect(length).toEqual(nbNodes + 1)
        }
      })
    })

    describe('when one "NodeMarker" component emits "newStation:after"', () => {
      const { wrapper, nodeMarkers } = mount()
      it('emits "createStation" with "{ newGraph, newStationId }"', async () => {
        for (let i = 0; i < nbNodes; i++) {
          const nodeCard = nodeMarkers.at(i)
          nodeCard.vm.$emit('newStation:after')
          await wrapper.vm.$nextTick()
          const emittedNodes = wrapper.emitted('createStation')[i][0].newGraph.nodes
          const length = Object.keys(emittedNodes).length
          expect(length).toEqual(nbNodes + 1)
        }
      })
    })
  })
})
