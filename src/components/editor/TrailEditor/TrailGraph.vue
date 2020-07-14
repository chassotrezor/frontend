<template>
  <div class="column items-center full-width">
    <div>Stations :</div>
    <basic-map
      height="500px"
      width="800px"
    >
      <node-marker
        v-for="(node, nodeId) in graph.nodes"
        :key="nodeId"
        :node="node"
        :first="isTrailEntry(nodeId)"
        :last="isEndNode(nodeId)"
        @updateNode="updateNode({ nodeId, newNode: $event })"
        @updateName="graph.nodes[nodeId].name = $event"
        @editStation="editStation(nodeId)"
        @remove="removeNode(node.nodeId)"
        @newStation:after="createStationAfter(nodeId)"
        @newStation:before="createStationBefore(nodeId)"
        @move:before="moveBefore(nodeId)"
        @move:after="moveAfter(nodeId)"
      />
      <l-polyline
        :lat-lngs="positionsInOrder"
        color="black"
        :dash-array="[5, 10]"
      />
    </basic-map>
  </div>
</template>

<script>
import { LPolyline } from 'vue2-leaflet'
import BasicMap from 'components/Navigation/map/BasicMap'
import NodeMarker from './NodeMarker'
import PositionTranslator from 'src/mixins/PositionTranslator'
import { generateNodeBefore, generateNodeAfter } from './graphHelpers'

export default {
  name: 'TrailGraph',
  components: {
    BasicMap,
    NodeMarker,
    LPolyline
  },
  mixins: [PositionTranslator],
  props: {
    graph: {
      type: Object,
      required: true
    }
  },
  computed: {
    positionsInOrder () {
      let currentNode = this.graph.nodes[this.graph.endNodes[0]]
      if (!currentNode) return []
      const positions = [this.fromGeopoint(currentNode.position).toArray()]
      while (currentNode.dependencies.length > 0) {
        currentNode = this.graph.nodes[currentNode.dependencies[0]]
        const position = this.fromGeopoint(currentNode.position).toArray()
        positions.unshift(position)
      }
      return positions
    }
  },
  methods: {
    isTrailEntry (nodeId) {
      return this.graph.trailEntries.some(entryId => nodeId === entryId)
    },
    isEndNode (nodeId) {
      return this.graph.endNodes.some(endNodeId => nodeId === endNodeId)
    },
    createStationAfter (nodeId) {
      const newGraphAndNewStationId = generateNodeAfter(nodeId, this.graph)
      this.$emit('createStation', newGraphAndNewStationId)
    },
    createStationBefore (nodeId) {
      const newGraphAndNewStationId = generateNodeBefore(nodeId, this.graph)
      this.$emit('createStation', newGraphAndNewStationId)
    },
    editStation (stationId) {
      this.$emit('editStation', stationId)
    },
    updateNode ({ nodeId, newNode }) {
      const newNodes = {
        ...this.graph.nodes,
        [nodeId]: {
          ...newNode
        }
      }
      this.$emit('updateGraph', {
        nodes: newNodes,
        endNodes: this.graph.endNodes,
        trailEntries: this.graph.trailEntries
      })
    },
    removeNode (nodeId) {
      this.deleteNodeInTrail({ trailId: this.trailId, nodeId })
    }
  }
}
</script>
