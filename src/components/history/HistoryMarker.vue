<template>
  <div>
    <l-marker
      class="LMarker_test"
      :lat-lng="station.latLng"
      clickable
      @click="push"
    >
      <l-icon
        :icon-size="size"
        :icon-anchor="anchor"
        :shadow-size="shadowSize"
        :shadow-anchor="shadowAnchor"
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="31"
          height="44"
        >
          <path
            d="m 15.499977,0.60290157 c -8.2360723,0 -14.89728562,6.65089133 -14.89728562,14.87427643 0,11.155703 14.89728562,27.623682 14.89728562,27.623682 0,0 14.897279,-16.467979 14.897279,-27.623682 0,-8.2233851 -6.661214,-14.87427643 -14.897279,-14.87427643 z"
            :style="`fill:${station.color};stroke:#ffffff;stroke-width:1.2`"
          />
          <circle
            r="10"
            cy="15.913239"
            cx="15.499971"
            style="fill:#ffffff"
          />
          <rect
            rx="2"
            ry="2"
            y="13.985931"
            x="13.621302"
            height="10.583241"
            width="4"
            :style="`fill:${station.color}`"
          />
          <circle
            r="2"
            cy="10.21916"
            cx="15.499971"
            :style="`fill:${station.color}`"
          />
        </svg>
      </l-icon>
      <l-tooltip class="column items-center LTooltip_test">
        <div
          class="text-h6"
          :style="`color: ${station.color}`"
        >
          {{ station.trailName }}
        </div>
        <div
          class="text-body1"
          :style="`color: ${station.color}`"
        >
          {{ station.stationName }}
        </div>
      </l-tooltip>
    </l-marker>
  </div>
</template>

<script>
import { LMarker, LIcon, LTooltip } from 'vue2-leaflet'

export default {
  name: 'HistoryMarker',
  components: {
    LMarker,
    LIcon,
    LTooltip
  },
  props: {
    station: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      size: [31, 44],
      anchor: [15, 44],
      shadowSize: [5, 3],
      shadowAnchor: [2, 1]
    }
  },
  methods: {
    push () {
      this.$router.push({
        name: 'station',
        params: {
          trailId: this.station.trailId,
          stationId: this.station.stationId
        }
      })
    }
  }
}
</script>
