<template>
  <l-marker
    class="LMarker_test"
    :lat-lng="latLng"
  >
    <l-icon
      :icon-size="size"
      :icon-anchor="anchor"
      :icon-url="url"
      :shadow-size="shadowSize"
      :shadow-anchor="shadowAnchor"
      :shadow-url="shadowUrl"
    />
    <l-tooltip :options="{ parmanent: true }">
      <div>
        {{ name }}
      </div>
    </l-tooltip>
  </l-marker>
</template>

<script>
import { LMarker, LTooltip, LIcon } from 'vue2-leaflet'
import trailMarker from 'assets/trailPlace.png'
import shadow from 'assets/shadow.png'

export default {
  name: 'TrailsMarker',
  components: {
    LMarker,
    LTooltip,
    LIcon
  },
  props: {
    latLng: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      url: trailMarker,
      size: [31, 44],
      anchor: [15, 44],
      shadowUrl: shadow,
      shadowSize: [5, 3],
      shadowAnchor: [2, 1]
    }
  }
}
</script>
