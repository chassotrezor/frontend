<template>
  <div class="full-width">
    <update-btn
      :old-data="{ graph: trail.graph, name: trail.name }"
      :new-data="{ graph, name }"
      :update-fn="updateTrailWithPosition"
      :cancel-fn="() => duplicateTrail(trail)"
    />
    <q-input v-model="name" />
    <br>
    <trail-graph
      class="TrailGraph_test"
      :graph="graph"
      @updateName="updateName"
      @updateGraph="updateGraph"
      @editStation="editStation($event)"
      @createStation="updateTrailAndCreateStation"
      @removeStation="removeStation($event)"
    />
    <qr-codes-generator
      class="QrCodesGenerator_test"
      :trail-id="trailId"
      :trail-name="trail.name"
      :trail-nodes="trail.graph.nodes"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrailGraph from './TrailGraph'
import QrCodesGenerator from './QrCodesGenerator'
import UpdateBtn from '../UpdateBtn'

export default {
  name: 'TrailEditor',
  components: {
    TrailGraph,
    QrCodesGenerator,
    UpdateBtn
  },
  props: {
    trailId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: '',
      graph: {
        trailEntries: [],
        endNodes: [],
        nodes: {}
      }
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      const trail = this.getTrail({ trailId: this.trailId })
      return trail
    }
  },
  watch: {
    trail (newTrail) {
      this.duplicateTrail(newTrail)
    }
  },
  mounted () {
    this.duplicateTrail(this.trail)
  },
  methods: {
    ...mapActions({
      updateTrail: 'editor/updateTrail',
      createStation: 'editor/createStation',
      removeStationInTrail: 'editor/removeStationInTrail'
    }),
    duplicateTrail (trail) {
      const vm = this
      this.name = trail.name
      this.graph.trailEntries = [...trail.graph.trailEntries]
      this.graph.endNodes = [...trail.graph.endNodes]
      Object.entries(trail.graph.nodes).forEach(node => {
        vm.$set(vm.graph.nodes, node[0], { ...node[1] })
      })
    },
    updateName ({ stationId, newName }) {
      this.graph.nodes[stationId].name = newName
    },
    updateGraph (graph) {
      this.graph.trailEntries = [...graph.trailEntries]
      this.graph.endNodes = [...graph.endNodes]
      this.graph.nodes = { ...graph.nodes }
    },
    // TODO: when geofirex will be accessible in vuex, replace this with a single transaction
    async updateTrailAndCreateStation ({ newGraph, newStationId }) {
      this.updateGraph(newGraph)
      await this.updateTrailWithPosition()
      return this.createStation({
        trailId: this.trailId,
        stationId: newStationId
      })
    },
    editStation (stationId) {
      this.$emit('editStation', stationId)
    },
    updateTrailWithPosition () {
      const startStationId = this.graph.trailEntries[0]
      const trailGeopoint = this.graph.nodes[startStationId].position
      const position = this.$geo.point(...Object.values(trailGeopoint))
      return this.updateTrail({
        trailId: this.trailId,
        newProps: {
          name: this.name,
          position,
          graph: this.graph
        }
      })
    },
    removeStation ({ removedStationId, updatedGraph }) {
      this.updateGraph(updatedGraph)
      return this.removeStationInTrail({ trailId: this.trailId, removedStationId, updatedGraph })
    }
  }
}
</script>
