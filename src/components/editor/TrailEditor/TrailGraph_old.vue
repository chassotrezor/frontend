<template>
  <div>
    <div>Stations :</div>
    <node-card
      v-for="(node, index) in graph"
      :key="node.nodeId"
      class="NodeCard_test"
      :node="node"
      :first="index === 0"
      :last="index === graph.length - 1"
      @editStation="editStation(node.nodeId)"
      @editNode="editNode(node.nodeId)"
      @remove="removeNode(node.nodeId)"
      @up="up(index)"
      @down="up(index + 1)"
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
  name: 'TrailGraph',
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
    nodes () {
      return this.trail.nodes
    },
    endNodes () {
      return this.trail.endNodes
    },
    trailEntries () {
      return this.trail.trailEntries
    },
    graph () {
      if (
        !this.endNodes ||
        this.endNodes.length === 0
      ) return []
      else {
        let nodeId = this.endNodes[0]
        let node
        const list = []
        do {
          node = this.nodes[nodeId]
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
      deleteNodeInTrail: 'editor/deleteNodeInTrail',
      updateTrail: 'editor/updateTrail'
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
    },
    up (index) {
      if (index > 0 && index < this.graph.length) {
        const nodeId1 = this.graph[index - 1].nodeId
        const nodeId2 = this.graph[index].nodeId
        const dependencies1 = [...this.nodes[nodeId1].dependencies]
        const dependencies2 = [...this.nodes[nodeId2].dependencies]
        let trailEntries = [...this.trailEntries]
        const nodes = JSON.parse(JSON.stringify(this.nodes))
        let endNodes = [...this.endNodes]
        let dependencies3
        if (index === 1) {
          trailEntries = [nodeId2]
        }
        if (index + 1 === this.graph.length) {
          dependencies3 = [...this.endNodes]
          endNodes = dependencies2
        } else {
          const nodeId3 = this.graph[index + 1].nodeId
          dependencies3 = [...this.nodes[nodeId3].dependencies]
          nodes[nodeId3].dependencies = dependencies2
        }
        nodes[nodeId1].dependencies = dependencies3
        nodes[nodeId2].dependencies = dependencies1

        this.updateTrail({
          trailId: this.trailId,
          newProps: {
            trailEntries,
            nodes,
            endNodes
          }
        })
      }
    }
  }
}
</script>
