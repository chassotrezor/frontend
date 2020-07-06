<template>
  <div
    class="row items-center"
  >
    <q-btn
      class="UnselectBtn_test"
      icon="edit"
      @click="$emit('unselect')"
    />
    <div> > </div>
    <q-select
      class="QSelectTrail_test"
      :value="trail"
      :options="trailsOptions"
      @input="$emit('editTrail', $event.value)"
    />
    <div> > </div>
    <q-select
      v-if="selectedTrail"
      class="QSelectStation_test"
      :value="station"
      :options="stationsOptions"
      @input="$emit('editStation', $event.value)"
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
      myTrails: 'editor/myTrails',
      getTrail: 'editor/getTrail'
    }),
    trailsOptions () {
      return Object.values(this.myTrails).map(trail => {
        return {
          value: trail.id,
          label: trail.name
        }
      })
    },
    stationsOptions () {
      if (this.selectedTrail) {
        const nodes = this.getTrail({ trailId: this.selectedTrail }).nodes
        return Object.values(nodes).map(station => {
          return {
            value: station.id,
            label: station.name
          }
        })
      } else {
        return []
      }
    },
    trail () {
      return this.trailsOptions.find(option => option.value === this.selectedTrail)
    },
    station () {
      return this.stationsOptions.find(option => option.value === this.selectedStation)
    }
  }
}
</script>
