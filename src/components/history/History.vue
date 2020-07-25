<template>
  <div class="full-width">
    <basic-map
      width="100%"
      height="100%"
      :zoom="2"
    >
      <history-marker
        v-for="station in stations"
        :key="station.stationId"
        class="StationsListMarker_test"
        :station="station"
      />
    </basic-map>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BasicMap from 'components/Navigation/map/BasicMap'
import HistoryMarker from './HistoryMarker'
import { fromGeopoint } from 'src/helpers/mapHelpers'

export default {
  name: 'History',
  components: {
    BasicMap,
    HistoryMarker
  },
  computed: {
    ...mapGetters({
      accessibleStations: 'user/accessibleStations',
      lastTrail: 'user/lastTrail'
    }),
    stations () {
      if (this.accessibleStations) {
        const trails = Object.entries(this.accessibleStations)
        const stations = []
        trails.forEach(trail => {
          if (trail[1].data.display) {
            Object.entries(trail[1].stations).forEach(station => {
              stations.push({
                trailId: trail[0],
                trailName: trail[1].data.name,
                stationId: station[0],
                stationName: station[1].name,
                latLng: fromGeopoint(station[1].position).toLatLng(),
                color: trail[1].data.color
              })
            })
          }
        })
        return stations
      } else {
        return []
      }
    }
  }
}
</script>
