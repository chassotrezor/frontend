<template>
  <l-map
    :style="style"
    :zoom="zoom"
    :center="center"
    @update:bounds="$emit('update:bounds', $event)"
    @update:zoom="$emit('update:zoom', $event)"
    @update:center="$emit('update:center', $event)"
    @ready="init"
  >
    <l-tile-layer :url="url" />
    <l-circle
      :lat-lng="[position.latitude, position.longitude]"
      :radius="position.accuracy / 2"
      color="black"
    />
    <l-marker
      :lat-lng="[position.latitude, position.longitude]"
      :z-index-offset="1000"
    >
      <l-icon
        :icon-size="positionMarker.size"
        :icon-anchor="positionMarker.anchor"
        :icon-url="positionMarker.url"
      />
    </l-marker>
    <slot />
  </l-map>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LCircle
} from 'vue2-leaflet'
import FillPageHeight from 'src/mixins/FillPageHeight'
import positionMarker from 'assets/hat.png'

export default {
  name: 'BasicMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LCircle
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
      zoom: 10,
      center: [0, 0],
      positionMarker: {
        url: positionMarker,
        size: [61, 39],
        anchor: [30, 19]
      },
      position: {
        latitude: 0,
        longitude: 0,
        accuracy: 1
      },
      positionWatcher: null
    }
  },
  computed: {
    style () {
      if (this.fullPageHeight) return `height: ${this.pageHeight}px`
      else return ''
    }
  },
  beforeDestroy () {
    navigator.geolocation.clearWatch(this.positionWatcher)
  },
  methods: {
    init (event) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.center = [position.coords.latitude, position.coords.longitude]
        },
        err => console.error('getCurrentPosition', err)
      )
      this.positionWatcher = navigator.geolocation.watchPosition(
        position => {
          this.position = position.coords
        },
        err => console.error('watchPosition', err)
      )
      this.$emit('ready', event)
    }
  }
}
</script>
