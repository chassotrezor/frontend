<template>
  <div>
    <div>Title</div>
    <div
      v-for="row in station.rows"
      :key="row.rowId"
    >
      <station-image
        v-if="row.type === 'image'"
        class="StationImage_test"
        :src="row.url"
      />
      <station-text
        v-if="row.type === 'text'"
        class="StationText_test"
        :raw-html="row.rawHtml"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import StationImage from './StationImage'
import StationText from './StationText'

export default {
  name: 'Station',
  components: {
    StationImage,
    StationText
  },
  computed: {
    ...mapGetters({
      getStation: 'trail/getStation'
    }),
    station () {
      const trailId = this.$route.params.trailId
      const stationId = this.$route.params.stationId
      return this.getStation({ trailId, stationId })
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
