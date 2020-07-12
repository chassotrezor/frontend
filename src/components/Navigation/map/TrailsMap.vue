<template>
  <basic-map
    full-page-height
    @ready="init"
    @update:bounds="updateBounds"
  >
    <trail-marker
      v-for="trail in trails"
      :key="trail.trailId"
      :trail="trail"
    />
  </basic-map>
</template>

<script>
import BasicMap from './BasicMap'
import TrailMarker from './TrailMarker'
import trailMarker from 'assets/trailPlace.png'
import { isOutOfBoundsBounds, getRadius } from './mapHelpers'

export default {
  name: 'TrailsMap',
  components: {
    BasicMap,
    TrailMarker
  },
  data () {
    return {
      trails: [],
      trailMarker: {
        url: trailMarker,
        size: [31, 44],
        anchor: [15, 44]
      },
      oldBounds: {
        _northEast: { lat: 0, lng: 0 },
        _southWest: { lat: 0, lng: 0 }
      }
    }
  },
  methods: {
    queryTrails ({ center, radius }) {
      const query = this.$geo.query('trails').within(this.$geo.point(...center), radius, 'position')
      query.subscribe(trails => {
        this.trails = trails.map(trail => {
          return {
            position: Object.values(trail.position.geopoint),
            name: trail.name,
            // TODO: get trailId from backend
            trailId: trail.name + Math.random().toString(36).substring(2)
          }
        })
      })
    },
    updateBounds (newBounds) {
      const mustUpdate = isOutOfBoundsBounds({
        newBounds,
        oldBounds: this.oldBounds,
        positionChangeToleranceRatio: 0.1
      })
      if (mustUpdate) {
        const center = [
          (newBounds._northEast.lat + newBounds._southWest.lat) / 2,
          (newBounds._northEast.lng + newBounds._southWest.lng) / 2
        ]
        const radius = getRadius({ bounds: newBounds })
        this.oldBounds = newBounds
        this.queryTrails({ center, radius })
      }
    },
    init (event) {
      this.updateBounds(event.getBounds())
    }
  }
}
</script>
