import { defaultNode } from 'src/store/defaultData'
import PositionTranslator from 'src/mixins/PositionTranslator'

export function generateId () {
  return Math.random().toString(36).substring(2)
}

export function generateIdIn (object) {
  const objectIds = Object.keys(object)
  const idAlreadyExists = id => objectIds.some(nodeId => id === nodeId)
  let newId
  do {
    newId = generateId()
  } while (idAlreadyExists(newId))
  return newId
}

function getNextNodeId (nodeId, graph) {
  let candidate = graph.endNodes[0]
  if (candidate === nodeId) return null

  let dependency = graph.nodes[candidate].dependencies[0]
  while (dependency !== nodeId) {
    candidate = dependency
    dependency = graph.nodes[candidate].dependencies[0]
  }
  return candidate
}

function getPreviousNodeId (nodeId, graph) {
  const node = graph.nodes[nodeId]
  return node.dependencies[0] || null
}

function getPosition1ArcSecEastFrom (nodeId, graph) {
  const nodeGeopoint = graph.nodes[nodeId].position
  const positionArray = PositionTranslator.methods.fromGeopoint(nodeGeopoint).toArray()
  const newPositionArray = [positionArray[0], positionArray[1] + 1 / 360]
  const newGeopoint = PositionTranslator.methods.fromArray(newPositionArray).toGeopoint()
  return newGeopoint
}

function getMiddlePosition (firstNodeId, secondNodeId, graph) {
  const firstNodeGeopoint = graph.nodes[firstNodeId].position
  const secondNodeGeopoint = graph.nodes[secondNodeId].position
  const firstPositionArray = PositionTranslator.methods.fromGeopoint(firstNodeGeopoint).toArray()
  const secondPositionArray = PositionTranslator.methods.fromGeopoint(secondNodeGeopoint).toArray()
  const centerArray = firstPositionArray.map((currentAxis, index) => {
    return (currentAxis + secondPositionArray[index]) / 2
  })
  const centerGeopoint = PositionTranslator.methods.fromArray(centerArray).toGeopoint()
  return centerGeopoint
}

function insertNodeBefore (beforeNodeId, newNode, graph) {
  const before = graph.nodes[beforeNodeId]
  const newNodeId = generateIdIn(graph.nodes)
  newNode.dependencies = [...before.dependencies]
  const newGraph = {
    ...graph,
    nodes: {
      ...graph.nodes,
      [newNodeId]: newNode,
      [beforeNodeId]: {
        ...before,
        dependencies: [newNodeId]
      }
    }
  }
  return {
    newGraph,
    newStationId: newNodeId
  }
}

function generateNodeBeforeFirst (firstNodeId, graph) {
  const newNodeId = generateIdIn(graph.nodes)
  const newPosition = getPosition1ArcSecEastFrom(firstNodeId, graph)
  const newNode = defaultNode(newPosition)
  const newGraph = {
    ...graph,
    trailEntries: [newNodeId],
    nodes: {
      ...graph.nodes,
      [firstNodeId]: {
        ...graph.nodes[firstNodeId],
        dependencies: [newNodeId]
      },
      [newNodeId]: newNode
    }
  }
  return {
    newGraph,
    newStationId: newNodeId
  }
}

function generateNodeBetween (firstNodeId, secondNodeId, graph) {
  const newPosition = getMiddlePosition(firstNodeId, secondNodeId, graph)
  const newNode = defaultNode(newPosition)
  const newGraphAndNewId = insertNodeBefore(secondNodeId, newNode, graph)
  return newGraphAndNewId
}

function generateNodeAfterLast (lastNodeId, graph) {
  const newNodeId = generateIdIn(graph.nodes)
  const newPosition = getPosition1ArcSecEastFrom(lastNodeId, graph)
  const newNode = defaultNode(newPosition)
  newNode.dependencies = [lastNodeId]
  const newGraph = {
    ...graph,
    endNodes: [newNodeId],
    nodes: {
      ...graph.nodes,
      [newNodeId]: newNode
    }
  }
  return {
    newGraph,
    newStationId: newNodeId
  }
}

export function generateNodeBefore (nodeId, graph) {
  const previousNodeId = getPreviousNodeId(nodeId, graph)
  if (previousNodeId) return generateNodeBetween(previousNodeId, nodeId, graph)
  else return generateNodeBeforeFirst(nodeId, graph)
}

export function generateNodeAfter (nodeId, graph) {
  const nextNodeId = getNextNodeId(nodeId, graph)
  if (nextNodeId) return generateNodeBetween(nodeId, nextNodeId, graph)
  else return generateNodeAfterLast(nodeId, graph)
}

export function moveBefore (nodeId, graph) {
  const previousNodeId = getPreviousNodeId(nodeId, graph)
  if (!previousNodeId) return graph

  const previousIsFirst = graph.nodes[previousNodeId].dependencies.length === 0
  const nextNodeId = getNextNodeId(nodeId, graph)
  const isLast = !nextNodeId

  let newGraph
  if (isLast) {
    newGraph = {
      ...graph,
      nodes: {
        ...graph.nodes,
        [previousNodeId]: {
          ...graph.nodes[previousNodeId],
          dependencies: [...graph.endNodes]
        },
        [nodeId]: {
          ...graph.nodes[nodeId],
          dependencies: [...graph.nodes[previousNodeId].dependencies]
        }
      },
      trailEntries: previousIsFirst ? [nodeId] : [...graph.trailEntries],
      endNodes: [...graph.nodes[nodeId].dependencies]
    }
  } else {
    newGraph = {
      ...graph,
      nodes: {
        ...graph.nodes,
        [previousNodeId]: {
          ...graph.nodes[previousNodeId],
          dependencies: [...graph.nodes[nextNodeId].dependencies]
        },
        [nodeId]: {
          ...graph.nodes[nodeId],
          dependencies: [...graph.nodes[previousNodeId].dependencies]
        },
        [nextNodeId]: {
          ...graph.nodes[nextNodeId],
          dependencies: [...graph.nodes[nodeId].dependencies]
        }
      },
      trailEntries: previousIsFirst ? [nodeId] : [...graph.trailEntries]
    }
  }
  return newGraph
}

export function moveAfter (nodeId, graph) {
  const nextNodeId = getNextNodeId(nodeId, graph)
  if (!nextNodeId) return graph
  else return moveBefore(nextNodeId, graph)
}

export function remove (nodeId, graph) {
  const previousNodeId = getPreviousNodeId(nodeId, graph)
  const isFirst = !previousNodeId

  const nextNodeId = getNextNodeId(nodeId, graph)
  const isLast = !nextNodeId

  if (isFirst && isLast) return graph

  const newGraph = {
    ...graph,
    nodes: {
      ...graph.nodes
    }
  }
  delete newGraph.nodes[nodeId]

  if (isFirst) {
    newGraph.trailEntries = [nextNodeId]
    newGraph.nodes[nextNodeId].dependencies = []
  } else if (isLast) {
    newGraph.endNodes = [previousNodeId]
  } else {
    newGraph.nodes[nextNodeId].dependencies = [previousNodeId]
  }

  return newGraph
}
