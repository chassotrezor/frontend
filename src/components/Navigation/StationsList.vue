<template>
  <div>
    Stations List
    <div
      v-if="hasTrails"
    >
      <q-select
        v-model="selectedTrail"
        class="QSelect_test"
        :options="trails"
      />
      <q-list>
        <q-item
          v-for="stationId in stations"
          :key="stationId"
          class="QItem_test"
          :class="`${stationId}_test`"
          clickable
          @click="() => push(stationId)"
        >
          <q-item-section>
            <q-item-label>
              {{ accessibleStations[selectedTrail.value].stations[stationId].name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      no station yet
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StationsList',
  data () {
    return {
      selectedTrail: undefined
    }
  },
  computed: {
    ...mapGetters({
      accessibleStations: 'user/accessibleStations',
      lastTrail: 'user/lastTrail'
    }),
    trails () {
      if (this.accessibleStations) {
        return Object.entries(this.accessibleStations).map(trail => {
          return {
            label: trail[1].data.name,
            value: trail[0]
          }
        })
      } else {
        return []
      }
    },
    stations () {
      if (
        this.selectedTrail &&
        this.accessibleStations &&
        this.accessibleStations[this.selectedTrail.value] &&
        this.accessibleStations[this.selectedTrail.value].stations
      ) {
        return Object.keys(this.accessibleStations[this.selectedTrail.value].stations)
      } else {
        return undefined
      }
    },
    hasTrails () {
      return Object.keys(this.trails).length > 0
    }
  },
  watch: {
    lastTrail (trailId) {
      this.selectedTrail = this.trails.find(option => option.value === trailId)
    }
  },
  mounted () {
    this.selectedTrail = this.trails.find(option => option.value === this.lastTrail)
  },
  methods: {
    push (station) {
      const route = {
        name: 'station',
        params: {
          trailId: this.selectedTrail.value,
          stationId: station
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
