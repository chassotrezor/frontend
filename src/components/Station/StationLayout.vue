<template>
  <div>
    <div v-if="station">
      <station
        v-if="playerIsChasing"
        class="Station_test"
      />
      <div v-else>
        <trail-info
          class="TrailInfo_test"
        />
        <start-trail
          v-if="station.isTrailEntry"
          class="StartTrail_test"
        />
      </div>
    </div>
    <spinner-with-message
      v-else
      class="SpinnerWithMessage_test"
      :message="$t('trail.station.waitForStation')"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrailInfo from './TrailInfo'
import Station from './Station/Station'
import SpinnerWithMessage from 'components/Navigation/SpinnerWithMessage'
import StartTrail from './StartTrail'

export default {
  name: 'StationLayout',
  components: {
    TrailInfo,
    Station,
    SpinnerWithMessage,
    StartTrail
  },
  computed: {
    ...mapGetters({
      getStation: 'trail/getStation',
      openTrails: 'user/openTrails'
    }),
    station () {
      const trailId = this.$route.params.trailId
      const stationId = this.$route.params.stationId
      return this.getStation({ trailId, stationId })
    },
    playerIsChasing () {
      const trailId = this.$route.params.trailId
      if (this.openTrails) return this.openTrails.some(id => id === trailId)
      else return false
    }
  },
  mounted () {
    const trailId = this.$route.params.trailId
    const stationId = this.$route.params.stationId
    this.downloadStation({ trailId, stationId })
  },
  methods: {
    ...mapActions({
      downloadStation: 'trail/downloadStation'
    })
  }
}
</script>
