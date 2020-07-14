<template>
  <div>
    <q-input v-model="name" />
    <q-btn
      class="UpdateBtn_test"
      icon="send"
      color="primary"
      @click="updateTrailWithPosition"
    />
    <br>
    <trail-graph
      class="TrailGraph_test"
      :graph="graph"
      @updateGraph="updateGraph"
      @editStation="editStation($event)"
      @createStation="updateTrailAndCreateStation"
    />
    <qr-codes-generator
      :trail-id="trailId"
      :trail-name="trail.name"
      :trail-nodes="trail.nodes"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrailGraph from './TrailGraph'
import QrCodesGenerator from './QrCodesGenerator'

export default {
  name: 'TrailEditor',
  components: {
    TrailGraph,
    QrCodesGenerator
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
  mounted () {
    const vm = this
    this.name = this.trail.name
    this.graph.trailEntries = [...this.trail.trailEntries]
    this.graph.endNodes = [...this.trail.endNodes]
    Object.entries(this.trail.nodes).forEach(node => {
      vm.$set(vm.graph.nodes, node[0], { ...node[1] })
    })
  },
  methods: {
    ...mapActions({
      updateTrail: 'editor/updateTrail',
      createStation: 'editor/createStation'
    }),
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
          endNodes: this.graph.endNodes,
          trailEntries: this.graph.trailEntries,
          nodes: this.graph.nodes
        }
      })
    }
  }
}
</script>
