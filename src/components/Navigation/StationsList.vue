<template>
  <div class="full-width">
    <basic-map
      width="100%"
      height="100%"
    >
      <station-list-marker
        v-for="station in stations"
        :key="station.stationId"
        :station="station"
      />
    </basic-map>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BasicMap from 'components/Navigation/map/BasicMap'
import StationListMarker from './StationListMarker'
import { fromGeopoint } from 'src/helpers/mapHelpers'
// import { ratioToQuasarColor } from 'src/helpers/dataHelpers'

export default {
  name: 'StationsList',
  components: {
    BasicMap,
    StationListMarker
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
        trails.forEach((trail, index) => {
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
    },
    hasTrails () {
      return Object.keys(this.trails).length > 0
    }
  },
  methods: {
    ...mapActions({
      toggleTrail: 'user/toggleTrailDisplay',
      setTrailColor: 'user/setTrailColor'
    })
  }
}
</script>
