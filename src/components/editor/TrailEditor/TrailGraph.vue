<template>
  <div>
    <div>Stations :</div>
    <node-card
      v-for="node in graph"
      :key="node.nodeId"
      class="NodeCard_test"
      :node="node"
      @editStation="editStation(node.nodeId)"
      @editNode="editNode(node.nodeId)"
      @remove="removeNode(node.nodeId)"
    />
    <q-btn
      class="CreateStation_test"
      icon="add"
      label="nouvel indice"
      @click="createAndEditStation"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import NodeCard from './NodeCard'

export default {
  name: 'TrailEditor',
  components: {
    NodeCard
  },
  props: {
    trailId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.trailId })
    },
    graph () {
      if (this.trail.endNodes.length === 0) return []
      else {
        let nodeId = this.trail.endNodes[0]
        let node
        const list = []
        do {
          node = this.trail.nodes[nodeId]
          list.unshift({
            ...node,
            nodeId
          })
          nodeId = node.dependencies.length > 0 ? node.dependencies[0] : null
        } while (node.dependencies.length > 0)
        return list
      }
    }
  },
  methods: {
    ...mapActions({
      createStation: 'editor/createStation',
      deleteNodeInTrail: 'editor/deleteNodeInTrail'
    }),
    async createAndEditStation () {
      const trailId = this.trailId
      const stationId = await this.createStation({ trailId })
      this.editStation(stationId)
    },
    editStation (stationId) {
      this.$emit('editStation', stationId)
    },
    editNode (nodeId) {
      console.log('EDIT NODE')
    },
    removeNode (nodeId) {
      this.deleteNodeInTrail({ trailId: this.trailId, nodeId })
    }
  }
}
</script>
