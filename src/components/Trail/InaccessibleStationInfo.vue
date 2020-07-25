<template>
  <div class="full-width column items-center q-gutter-y-md q-pa-sm">
    <div class="text-body1 fit">
      {{ $t('trail.manage.foundStationOfTrail', { stationName, trailName }) }}
    </div>
    <div class="text-body1 fit">
      {{ $t('trail.manage.inaccessibleStation') }}
    </div>
    <div class="text-body1 fit">
      {{ $t('trail.manage.trailStartIsOnMap') }}
    </div>
    <basic-map
      class="BasicMap_test"
      width="80%"
      height="50%"
      :center="latLng"
      :zoom="14"
    >
      <trail-marker
        class="TrailMarker_test"
        :lat-lng="latLng"
        :name="trailName"
      />
    </basic-map>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fromGeopoint } from 'src/helpers/mapHelpers'
import BasicMap from 'components/Navigation/map/BasicMap'
import TrailMarker from 'components/Navigation/map/TrailMarker'

export default {
  name: 'InaccessibleStationInfo',
  components: {
    BasicMap,
    TrailMarker
  },
  computed: {
    ...mapGetters({
      getTrail: 'trails/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.$route.params.trailId })
    },
    latLng () {
      return fromGeopoint(this.trail.position.geopoint).toLatLng()
    },
    trailName () {
      return this.trail.name
    },
    stationName () {
      return this.trail.graph.nodes[this.$route.params.stationId].name
    }
  }
}
</script>
