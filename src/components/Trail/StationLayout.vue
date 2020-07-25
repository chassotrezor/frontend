<template>
  <div class="full-width full-height column justify-center items-center q-gutter-y-sm">
    <station
      v-if="station && trail && stationIsAccessible"
      class="Station_test"
    />
    <trail-info
      v-if="station && trail && !stationIsAccessible"
      class="TrailInfo_test"
    />
    <start-trail
      v-if="station && trail && !stationIsAccessible && isTrailEntry"
      class="StartTrail_test"
      @start="() => start = true"
    />
    <inaccessible-station-info
      v-if="station && trail && !stationIsAccessible && !isTrailEntry"
      class="InaccessibleStationInfo_test"
    />
    <spinner-with-message
      v-if="!station || !trail"
      class="SpinnerWithMessage_test q-pa-md"
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
import InaccessibleStationInfo from './InaccessibleStationInfo'

export default {
  name: 'StationLayout',
  components: {
    TrailInfo,
    Station,
    SpinnerWithMessage,
    StartTrail,
    InaccessibleStationInfo
  },
  data () {
    return {
      start: false
    }
  },
  computed: {
    ...mapGetters({
      getStation: 'trails/getStation',
      getTrail: 'trails/getTrail',
      openTrails: 'user/openTrails'
    }),
    trailId () {
      return this.$route.params.trailId
    },
    stationId () {
      return this.$route.params.stationId
    },
    trail () {
      return this.getTrail({ trailId: this.trailId })
    },
    station () {
      return this.getStation({ trailId: this.trailId, stationId: this.stationId })
    },
    trailIsOpen () {
      if (this.openTrails) return this.openTrails.some(id => id === this.trailId)
      else return false
    },
    isTrailEntry () {
      const vm = this
      return this.trail.graph.trailEntries.some(entryId => vm.stationId === entryId)
    },
    stationIsAccessible () {
      return this.trailIsOpen || this.start
    }
  },
  async mounted () {
    const trailId = this.$route.params.trailId
    const stationId = this.$route.params.stationId
    try {
      await this.downloadTrail({ trailId })
      await this.downloadStation({ trailId, stationId })
    } catch (error) {
      if (error.message === 'station does not exist' || error.message === 'trail does not exist') {
        this.$q.notify({
          type: 'warning',
          message: 'La page n\'existe plus',
          position: 'bottom-right',
          timeout: 2000
        })
        await this.updateTrailAccess({ trailId })
        this.$router.back()
      }
    }
  },
  methods: {
    ...mapActions({
      downloadTrail: 'trails/downloadTrail',
      downloadStation: 'trails/downloadStation',
      updateTrailAccess: 'user/updateTrailAccess'
    })
  }
}
</script>
