<template>
  <station-renderer
    :trail-name="station.trailName"
    :station-name="station.stationName"
    :rows="station.rows"
  />
</template>

<script>
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
      const stationName = trail.nodes[stationId].name
      const rows = this.getStation({ trailId, stationId }).rows
      return { trailName, stationName, rows }
    }
  },
  mounted () {
    const trailId = this.$route.params.trailId
    const stationId = this.$route.params.stationId
    this.saveStationAccess({ trailId, stationId })
  },
  methods: {
    ...mapActions({
      saveStationAccess: 'user/saveStationAccess'
    })
  }
}
</script>
