<template>
  <l-marker
    class="LMarker_test"
    :lat-lng="latLng"
    draggable
    :visible="visible"
    @update:lat-lng="$emit('update:lat-lng', $event)"
  >
    <l-icon
      :icon-size="size"
      :icon-anchor="anchor"
      :icon-url="url"
      :shadow-size="shadowSize"
      :shadow-anchor="shadowAnchor"
      :shadow-url="shadowUrl"
    />
    <l-popup
      :options="popupOptions"
    >
      <node-card
        class="NodeCard_test"
        :node="node"
        :first="first"
        :last="last"
        @editStation="$emit('editStation')"
        @inputName="$emit('updateName', $event)"
        @newStation:before="$emit('newStation:before')"
        @newStation:after="$emit('newStation:after')"
        @move:before="$emit('move:before')"
        @move:after="$emit('move:after')"
        @removeStation="removeStation"
      />
    </l-popup>
    <l-tooltip>
      {{ node.name }}
    </l-tooltip>
  </l-marker>
</template>

<script>
import { LMarker, LPopup, LIcon, LTooltip } from 'vue2-leaflet'
import { fromGeopoint } from 'src/helpers/mapHelpers'
import NodeCard from './NodeCard'
import station from 'assets/station.png'
import trailEntry from 'assets/trailEntry.png'
import endNode from 'assets/endNode.png'
import shadow from 'assets/shadow.png'

export default {
  name: 'NodeMarker',
  components: {
    LMarker,
    LPopup,
    LIcon,
    LTooltip,
    NodeCard
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    first: {
      type: Boolean,
      default: () => false
    },
    last: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      size: [31, 44],
      anchor: [15, 44],
      shadowUrl: shadow,
      shadowSize: [5, 3],
      shadowAnchor: [2, 1],
      visible: true,
      popupOptions: {
        offset: [0, -44],
        closeButton: false
      }
    }
  },
  computed: {
    url () {
      if (this.first) return trailEntry
      if (this.last) return endNode
      return station
    },
    latLng () {
      return fromGeopoint(this.node.position).toLatLng()
    }
  },
  methods: {
    removeStation () {
      this.$emit('removeStation', () => {
        this.visible = false
      })
    }
  }
}
</script>
