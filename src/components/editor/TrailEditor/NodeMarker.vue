<template>
  <l-marker
    class="LMarker_test"
    :lat-lng="fromGeopoint(node.position).toLatLng()"
    draggable
    @update:lat-lng="updatePosition"
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
      ref="popup"
      :options="popupOptions"
    >
      <node-card
        :node="node"
        :first="first"
        :last="last"
        @editStation="$emit('editStation')"
        @inputName="$emit('updateName', $event)"
        @newStation:before="$emit('newStation:before')"
        @newStation:after="$emit('newStation:after')"
        @move:before="$emit('move:before')"
        @move:after="$emit('move:after')"
        @remove="$emit('remove')"
      />
    </l-popup>
    <l-tooltip>
      {{ node.name }}
    </l-tooltip>
  </l-marker>
</template>

<script>
import { LMarker, LPopup, LIcon, LTooltip } from 'vue2-leaflet'
import PositionTranslator from 'src/mixins/PositionTranslator'
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
  mixins: [PositionTranslator],
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
    }
  },
  mounted () {
    setTimeout(this.refs.popup.update, 1000)
  },
  methods: {
    updatePosition (latLng) {
      const newNode = {
        ...this.node,
        position: this.fromLatLng(latLng).toGeopoint()
      }
      this.$emit('updateNode', newNode)
    }
  }
}
</script>
