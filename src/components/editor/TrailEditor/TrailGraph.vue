<template>
  <div class="column items-center">
    <basic-map
      height="500px"
      width="800px"
      :zoom="2"
      :center="latLng"
    >
      <node-marker
        v-for="(node, nodeId) in graph.nodes"
        :key="nodeId"
        class="NodeMarker_test"
        :node="node"
        :first="isTrailEntry(nodeId)"
        :last="isEndNode(nodeId)"
        @update:lat-lng="updatePosition(nodeId, $event)"
        @updateName="updateName(nodeId, $event)"
        @editStation="editStation(nodeId)"
        @removeStation="removeStation(nodeId)"
        @move:before="moveBefore(nodeId)"
        @move:after="moveAfter(nodeId)"
        @newStation:after="createStationAfter(nodeId)"
        @newStation:before="createStationBefore(nodeId)"
      />
      <l-polyline
        class="LPolyline_test"
        :lat-lngs="positionsInOrder"
        color="black"
        dash-array="5,10"
      />
    </basic-map>
  </div>
</template>

<script>
import { LPolyline } from 'vue2-leaflet'
import BasicMap from 'components/Navigation/map/BasicMap'
import NodeMarker from './NodeMarker'
import { fromGeopoint, fromLatLng } from 'src/helpers/mapHelpers'
import { generateNodeBefore, generateNodeAfter, moveBefore, moveAfter, remove, copyGraph } from 'src/helpers/graphHelpers'

export default {
  name: 'TrailGraph',
  components: {
    BasicMap,
    NodeMarker,
    LPolyline
  },
  props: {
    graph: {
      type: Object,
      required: true
    },
    center: {
      type: Object,
      default: () => {
        return {
          Rc: 0,
          Ac: 0
        }
      }
    }
  },
  computed: {
    positionsInOrder () {
      let currentNode = this.graph.nodes[this.graph.endNodes[0]]
      if (!currentNode) return []
      const positions = [fromGeopoint(currentNode.position).toArray()]
      while (currentNode.dependencies.length > 0) {
        currentNode = this.graph.nodes[currentNode.dependencies[0]]
        const position = fromGeopoint(currentNode.position).toArray()
        positions.unshift(position)
      }
      return positions
    },
    latLng () {
      return fromGeopoint(this.center).toLatLng()
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
    moveBefore (nodeId) {
      const newGraph = moveBefore(nodeId, this.graph)
      this.$emit('updateGraph', newGraph)
    },
    moveAfter (nodeId) {
      const newGraph = moveAfter(nodeId, this.graph)
      this.$emit('updateGraph', newGraph)
    },
    editStation (stationId) {
      this.$emit('editStation', stationId)
    },
    updateName (stationId, newName) {
      this.$emit('updateName', { stationId, newName })
    },
    updatePosition (stationId, latLng) {
      const newGraph = copyGraph(this.graph)
      const newPosition = fromLatLng(latLng).toGeopoint()
      newGraph.nodes[stationId].position = newPosition
      this.$emit('updateGraph', newGraph)
    },
    removeStation (nodeId) {
      const updatedGraph = remove(nodeId, this.graph)
      this.$emit('removeStation', { removedStationId: nodeId, updatedGraph })
    }
  }
}
</script>
