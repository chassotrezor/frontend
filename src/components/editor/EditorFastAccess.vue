<template>
  <div
    class="row items-center"
  >
    <q-btn
      class="UnselectBtn_test"
      icon="edit"
      flat
      @click="$emit('unselect')"
    />
    <q-btn
      v-if="selectedTrail"
      class="TrailName_test"
      :label="`> ${trailName}`"
      flat
      @click="$emit('editTrail')"
    />
    <q-btn
      v-if="selectedTrail && selectedStation"
      class="StationName_test"
      :label="`> ${stationName}`"
      flat
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EditorFastAccess',
  props: {
    selectedTrail: {
      type: String,
      default: () => undefined
    },
    selectedStation: {
      type: String,
      default: () => undefined
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.selectedTrail })
    },
    trailName () {
      return this.trail.name
    },
    stationName () {
      return this.trail.nodes[this.selectedStation].name
    }
  }
}
</script>
