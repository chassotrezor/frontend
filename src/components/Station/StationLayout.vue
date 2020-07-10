<template>
  <div>
    <div v-if="station && trail">
      <station
        v-if="stationIsAccessible"
        class="Station_test"
      />
      <div v-else>
        <trail-info
          class="TrailInfo_test"
        />
        <start-trail
          v-if="isTrailEntry"
          class="StartTrail_test"
          @start="() => start = true"
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
      return this.trail.trailEntries.some(entryId => vm.stationId === entryId)
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
