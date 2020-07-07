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
    <trail-graph
      class="TrailGraph_test"
      :trail-id="trailId"
      @editStation="editStation($event)"
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
      updateTrail: 'editor/updateTrail'
    }),
    editStation (stationId) {
      this.$emit('editStation', stationId)
    }
  }
}
</script>
