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
  data () {
    return {
      nodes: {},
      endNodes: []
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
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
  mounted () {
    const trail = this.getTrail({ trailId: this.trailId })
    this.endNodes = [...trail.endNodes]
    const vm = this
    Object.entries(trail.nodes).forEach(node => {
      vm.$set(vm.nodes, node[0], {})
      vm.$set(vm.nodes[node[0]], 'dependencies', [...node[1].dependencies])
      vm.$set(vm.nodes[node[0]], 'type', node[1].type)
      vm.$set(vm.nodes[node[0]], 'name', node[1].name)
    })
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
    },
    up (index) {
      if (index > 0 && index < this.graph.length) {
        const nodeId1 = this.graph[index - 1].nodeId
        const nodeId2 = this.graph[index].nodeId
        const dependencies1 = [...this.nodes[nodeId1].dependencies]
        const dependencies2 = [...this.nodes[nodeId2].dependencies]
        let dependencies3
        if (index + 1 === this.graph.length) {
          dependencies3 = [...this.endNodes]
          this.endNodes = dependencies2
        } else {
          const nodeId3 = this.graph[index + 1].nodeId
          dependencies3 = [...this.nodes[nodeId3].dependencies]
          this.nodes[nodeId3].dependencies = dependencies2
        }
        this.nodes[nodeId1].dependencies = dependencies3
        this.nodes[nodeId2].dependencies = dependencies1

        this.$emit('update', {
          nodes: this.nodes,
          endNodes: this.endNodes
        })
      }
    }
  }
}
</script>
