<template>
  <div>
    <q-input v-model="name" />
    <q-btn
      class="UpdateBtn_test"
      icon="send"
      color="primary"
      @click="updateTrail({ trailId, newProps: { name } })"
    />
    <br>
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
    <qr-codes-generator
      :trail-id="trailId"
      :trail-name="trail.name"
      :trail-nodes="trail.nodes"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NodeCard from './NodeCard'
import QrCodesGenerator from './QrCodesGenerator'

export default {
  name: 'TrailEditor',
  components: {
    NodeCard,
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
      name: ''
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
  mounted () {
    this.name = this.trail.name
  },
  methods: {
    ...mapActions({
      updateTrail: 'editor/updateTrail',
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
