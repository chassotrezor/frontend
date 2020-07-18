import { firestore } from 'firebase'
import types from 'src/types'
import {
  generateId,
  generateIdIn,
  generateNodeBefore,
  generateNodeAfter,
  moveBefore,
  moveAfter,
  copyGraph,
  copyNodes,
  copyNode
} from './graphHelpers'

const graph = {
  trailEntries: ['testNodeId1'],

  nodes: {
    testNodeId1: {
      name: 'testStationName1',
      type: types.nodes.STATION,
      dependencies: [],
      position: new firestore.GeoPoint(1, 1)
    },
    testNodeId2: {
      name: 'testStationName2',
      type: types.nodes.STATION,
      dependencies: ['testNodeId1'],
      position: new firestore.GeoPoint(2, 2)
    },
    testNodeId3: {
      name: 'testStationName3',
      type: types.nodes.STATION,
      dependencies: ['testNodeId2'],
      position: new firestore.GeoPoint(3, 3)
    },
    testNodeId4: {
      name: 'testStationName4',
      type: types.nodes.STATION,
      dependencies: ['testNodeId3'],
      position: new firestore.GeoPoint(4, 4)
    }
  },

  endNodes: ['testNodeId4']
}

const nodeIdsInOrder = [
  'testNodeId1',
  'testNodeId2',
  'testNodeId3',
  'testNodeId4'
]

describe('graphHelpers', () => {
  test('generateId returns a random String', () => {
    expect(generateId()).not.toBe(generateId())
  })

  test('generateIdIn returns a string different of all object keys', () => {
    const object = {}
    for (let i = 0; i < 100; i++) object[generateId()] = ''
    const newKey = generateIdIn(object)
    expect(object).not.toContain(newKey)
  })

  describe('generateNodeBefore returns { newGraph, newStationId } with added node', () => {
    test('before first', () => {
      const nodeId = nodeIdsInOrder[0]
      const { newGraph, newStationId } = generateNodeBefore(nodeId, graph)
      expect(newGraph.nodes[nodeId].dependencies).toEqual([newStationId])
      expect(newGraph.nodes[newStationId].dependencies).toEqual([])
    })

    test('before second', () => {
      const nodeId = nodeIdsInOrder[1]
      const { newGraph, newStationId } = generateNodeBefore(nodeId, graph)
      expect(newGraph.nodes[nodeId].dependencies).toEqual([newStationId])
      expect(newGraph.nodes[newStationId].dependencies).toEqual([nodeIdsInOrder[0]])
    })

    test('before last', () => {
      const nodeId = nodeIdsInOrder[3]
      const { newGraph, newStationId } = generateNodeBefore(nodeId, graph)
      expect(newGraph.nodes[nodeId].dependencies).toEqual([newStationId])
      expect(newGraph.nodes[newStationId].dependencies).toEqual([nodeIdsInOrder[2]])
    })
  })

  describe('generateNodeAfter returns { newGraph, newStationId } with added node', () => {
    test('after last', () => {
      const nodeId = nodeIdsInOrder[3]
      const { newGraph, newStationId } = generateNodeAfter(nodeId, graph)
      expect(newGraph.endNodes).toEqual([newStationId])
      expect(newGraph.nodes[newStationId].dependencies).toEqual([nodeId])
    })

    test('after penultimate', () => {
      const nodeId = nodeIdsInOrder[2]
      const { newGraph, newStationId } = generateNodeAfter(nodeId, graph)
      expect(newGraph.nodes[nodeIdsInOrder[3]].dependencies).toEqual([newStationId])
      expect(newGraph.nodes[newStationId].dependencies).toEqual([nodeId])
    })

    test('after first', () => {
      const nodeId = nodeIdsInOrder[0]
      const { newGraph, newStationId } = generateNodeAfter(nodeId, graph)
      expect(newGraph.nodes[nodeIdsInOrder[1]].dependencies).toEqual([newStationId])
      expect(newGraph.nodes[newStationId].dependencies).toEqual([nodeId])
    })
  })

  describe('moveBefore returns "newGraph" with node permuted with previous', () => {
    test('moveBefore("first node") returns unchanged graph', () => {
      const newGraph = moveBefore(nodeIdsInOrder[0], graph)
      expect(newGraph).toEqual(graph)
    })

    test('moveBefore("second node")', () => {
      const newGraph = moveBefore(nodeIdsInOrder[1], graph)
      expect(newGraph.nodes[nodeIdsInOrder[2]].dependencies).toEqual([nodeIdsInOrder[0]])
      expect(newGraph.nodes[nodeIdsInOrder[1]].dependencies).toEqual([])
      expect(newGraph.trailEntries).toEqual([nodeIdsInOrder[1]])
    })

    test('moveBefore("last node")', () => {
      const newGraph = moveBefore(nodeIdsInOrder[3], graph)
      expect(newGraph.endNodes).toEqual([nodeIdsInOrder[2]])
      expect(newGraph.nodes[nodeIdsInOrder[3]].dependencies).toEqual([nodeIdsInOrder[1]])
      expect(newGraph.nodes[nodeIdsInOrder[2]].dependencies).toEqual([nodeIdsInOrder[3]])
    })
  })

  describe('moveAfter returns "newGraph" with node permuted with next', () => {
    test('moveAfter("last node") returns unchanged graph', () => {
      const newGraph = moveAfter(nodeIdsInOrder[3], graph)
      expect(newGraph).toEqual(graph)
    })

    test('moveAfter("penultimate node")', () => {
      const newGraph = moveAfter(nodeIdsInOrder[2], graph)
      expect(newGraph.endNodes).toEqual([nodeIdsInOrder[2]])
      expect(newGraph.nodes[nodeIdsInOrder[3]].dependencies).toEqual([nodeIdsInOrder[1]])
      expect(newGraph.nodes[nodeIdsInOrder[2]].dependencies).toEqual([nodeIdsInOrder[3]])
    })

    test('moveAfter("first node")', () => {
      const newGraph = moveAfter(nodeIdsInOrder[0], graph)
      expect(newGraph.nodes[nodeIdsInOrder[2]].dependencies).toEqual([nodeIdsInOrder[0]])
      expect(newGraph.nodes[nodeIdsInOrder[1]].dependencies).toEqual([])
      expect(newGraph.trailEntries).toEqual([nodeIdsInOrder[1]])
    })
  })

  describe('copyGraph returns a deep copy of the graph', () => {
    test('both graph match', () => {
      const newGraph = copyGraph(graph)
      expect(newGraph).toEqual(graph)
    })

    test('changes on new graph do not affect old graph', () => {
      const newGraph = copyGraph(graph)
      newGraph.nodes.testNodeId1.dependencies[0] = 'newValue'
      expect(newGraph).not.toEqual(graph)
    })
  })

  describe('copyNodes returns a deep copy of the graph nodes', () => {
    test('both nodes collections match', () => {
      const newNodes = copyNodes(graph.nodes)
      expect(newNodes).toEqual(graph.nodes)
    })

    test('changes on new graph do not affect old graph', () => {
      const newNodes = copyNodes(graph.nodes)
      newNodes.testNodeId1.dependencies[0] = 'newValue'
      expect(newNodes).not.toEqual(graph.nodes)
    })
  })

  describe('copyNode returns a deep copy of one of the graph nodes', () => {
    test('both nodes match', () => {
      const newNode = copyNode(graph.nodes.testNodeId1)
      expect(newNode).toEqual(graph.nodes.testNodeId1)
    })

    test('changes on new graph do not affect old graph', () => {
      const newNode = copyNode(graph.nodes.testNodeId1)
      newNode.dependencies[0] = 'newValue'
      expect(newNode).not.toEqual(graph.nodes.testNodeId1)
    })
  })
})
