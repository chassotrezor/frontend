<template>
  <l-map
    ref="map"
    :style="style"
    :zoom="zoom"
    :center="center"
    @update:bounds="$emit('update:bounds', $event)"
    @update:zoom="$emit('update:zoom', $event)"
    @update:center="$emit('update:center', $event)"
    @ready="$emit('ready', $event)"
  >
    <l-tile-layer :url="url" />
    <l-circle
      v-if="showPosition"
      :lat-lng="[position.latitude, position.longitude]"
      :radius="position.accuracy"
      color="black"
    />
    <l-marker
      v-if="showPosition"
      :lat-lng="[position.latitude, position.longitude]"
      :z-index-offset="1000"
    >
      <l-icon
        :icon-size="positionMarker.size"
        :icon-anchor="positionMarker.anchor"
        :icon-url="positionMarker.url"
        :shadow-size="positionMarker.shadowSize"
        :shadow-anchor="positionMarker.shadowAnchor"
        :shadow-url="positionMarker.shadowUrl"
      />
    </l-marker>
    <l-control position="bottomleft">
      <q-btn
        :value="showPosition"
        round
        flat
        :icon="showPosition ? 'explore' : 'explore_off'"
        size="xl"
        @click="toggleWatch"
      />
    </l-control>
    <slot />
  </l-map>
</template>

<script>
import { latLng } from 'leaflet'
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LCircle,
  LControl
} from 'vue2-leaflet'
import FillPageHeight from 'src/mixins/FillPageHeight'
import positionMarker from 'assets/hat.png'
import shadow from 'assets/shadow.png'

export default {
  name: 'BasicMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LCircle,
    LControl
  },
  mixins: [FillPageHeight],
  props: {
    fullPageHeight: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 2,
      center: latLng(0, 0),
      positionMarker: {
        url: positionMarker,
        size: [61, 39],
        anchor: [30, 19],
        shadowUrl: shadow,
        shadowSize: [81, 45],
        shadowAnchor: [39, 9]
      },
      position: {
        latitude: 0,
        longitude: 0,
        accuracy: 1
      },
      positionWatcher: null,
      showPosition: false
    }
  },
  computed: {
    style () {
      if (this.fullPageHeight) return `height: ${this.pageHeight}px`
      else return ''
    }
  },
  beforeDestroy () {
    this.stopWatch()
  },
  methods: {
    geolocationError (error) {
      console.error(error)
      this.showPosition = false
      this.stopWatch()
    },
    startWatch () {
      navigator.geolocation.getCurrentPosition(
        position => {
          const newCenter = latLng(position.coords.latitude, position.coords.longitude)
          const map = this.$refs.map.mapObject
          if (map.getZoom() < 9) map.setView(newCenter, 9)
          else map.panTo(newCenter)
        },
        this.geolocationError
      )
      this.positionWatcher = navigator.geolocation.watchPosition(
        position => {
          this.position = position.coords
        },
        this.geolocationError
      )
    },
    stopWatch () {
      navigator.geolocation.clearWatch(this.positionWatcher)
    },
    toggleWatch () {
      this.showPosition = !this.showPosition
      if (this.showPosition) this.startWatch()
      else this.stopWatch()
    }
  }
}
</script>
