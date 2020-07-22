<template>
  <station-renderer
    class="StationRenderer_test"
    :trail-name="station.trailName"
    :station-name="station.stationName"
    :rows="station.rows"
  />
</template>

<script>
import firebase from 'firebase/app'
import { mapActions, mapGetters } from 'vuex'
import StationRenderer from './StationRenderer'

export default {
  name: 'Station',
  components: {
    StationRenderer
  },
  computed: {
    ...mapGetters({
      getStation: 'trails/getStation',
      getTrail: 'trails/getTrail'
    }),
    station () {
      const trailId = this.$route.params.trailId
      const stationId = this.$route.params.stationId
      const trail = this.getTrail({ trailId })
      const trailName = trail.name
      const stationName = trail.graph.nodes[stationId].name
      const rows = this.getStation({ trailId, stationId }).rows
      return { trailName, stationName, rows }
    }
  },
  mounted () {
    const trailId = this.$route.params.trailId
    const stationId = this.$route.params.stationId
    this.saveStationAccess({ trailId, stationId })
    if (firebase.auth().currentUser === null) {
      this.$q.notify({
        message: this.$t('trail.station.connectForFullUse'),
        color: 'warning',
        position: 'bottom-right',
        textColor: 'black'
      })
    }
  },
  methods: {
    ...mapActions({
      saveStationAccess: 'user/saveStationAccess'
    })
  }
}
</script>
