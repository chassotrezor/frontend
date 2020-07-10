<template>
  <l-map
    ref="page"
    :style="`height: ${pageHeight}px`"
    :zoom="zoom"
    :center="center"
  >
    <l-tile-layer :url="url" />
  </l-map>
</template>

<script>
import { mapGetters } from 'vuex'
import { LMap, LTileLayer } from 'vue2-leaflet'
import FillPageHeight from 'src/mixins/FillPageHeight'

export default {
  name: 'TrailsMap',
  components: {
    LMap,
    LTileLayer
  },
  mixins: [FillPageHeight],
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 9,
      center: [46.8, 7.1]
    }
  },
  computed: {
    ...mapGetters({
      trailsInZone: ''
    })
  }
}
</script>
