<template>
  <div>
    <q-input v-model="name" />
    <q-btn
      class="UpdateBtn_test"
      icon="send"
      color="primary"
      @click="update"
    />
    <q-input v-model="lat" />
    <q-input v-model="lng" />
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
      name: '',
      lat: 46.8,
      lng: 7.2
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
    this.lat = this.trail.position ? this.trail.position.geopoint.Rc : 0
    this.lng = this.trail.position ? this.trail.position.geopoint.Ac : 0
  },
  methods: {
    ...mapActions({
      updateTrail: 'editor/updateTrail'
    }),
    update () {
      this.updateTrail({
        trailId: this.trailId,
        newProps: {
          name: this.name,
          position: this.$geo.point(parseFloat(this.lat), parseFloat(this.lng))
        }
      })
    },
    editStation (stationId) {
      this.$emit('editStation', stationId)
    }
  }
}
</script>
