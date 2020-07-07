<template>
  <div>
    <div>Stations :</div>
    <node-card
      v-for="(node, nodeId) in trail.nodes"
      :key="nodeId"
      class="NodeCard_test"
      :node="node"
      @editStation="editStation(nodeId)"
      @editNode="editNode(nodeId)"
      @remove="removeNode(nodeId)"
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
