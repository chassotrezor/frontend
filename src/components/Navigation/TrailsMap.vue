<template>
  <l-map
    ref="page"
    :style="`height: ${pageHeight}px`"
    :zoom="zoom"
    :center="center"
    @update:bounds="updateBounds"
    @ready="updateBounds($event.getBounds())"
  >
    <l-tile-layer :url="url" />
    <l-marker
      v-for="trail in trails"
      :key="trail.trailId"
      :lat-lng="trail.position"
    >
      <l-icon
        :icon-size="iconSize"
        :icon-anchor="iconAnchor"
        :icon-url="icon"
      />
      <l-tooltip :options="{parmanent: true}">
        <div>
          {{ trail.name }}
        </div>
      </l-tooltip>
    </l-marker>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LTooltip, LIcon } from 'vue2-leaflet'
import FillPageHeight from 'src/mixins/FillPageHeight'
import icon from 'assets/trailPlace.png'
import { isOutOfBoundsBounds, getRadius } from './mapHelpers'

export default {
  name: 'TrailsMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LIcon
  },
  mixins: [FillPageHeight],
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 9,
      center: [46.8, 7.1],
      trails: [],
      icon: icon,
      iconSize: [31, 44],
      iconAnchor: [15, 44],
      bounds: {
        _northEast: { lat: 0, lng: 0 },
        _southWest: { lat: 0, lng: 0 }
      }
    }
  },
  methods: {
    updateBounds (newBounds) {
      const mustUpdate = isOutOfBoundsBounds({
        newBounds,
        oldBounds: this.bounds,
        positionChangeToleranceRatio: 0.1
      })
      if (mustUpdate) {
        this.center = [
          (newBounds._northEast.lat + newBounds._southWest.lat) / 2,
          (newBounds._northEast.lng + newBounds._southWest.lng) / 2
        ]
        this.bounds = newBounds
        this.radius = getRadius({ bounds: newBounds })
        this.queryTrails()
      }
    },
    queryTrails () {
      const query = this.$geo.query('trails').within(this.$geo.point(...this.center), this.radius, 'position')
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
    }
  }
}
</script>
