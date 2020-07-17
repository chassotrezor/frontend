<template>
  <div class="full-width">
    <editor-fast-access
      class="EditorFastAccess_test"
      :selected-trail="selectedTrail"
      :selected-station="selectedStation"
      @editTrail="() => editTrail(selectedTrail)"
      @unselect="unselect"
    />
    <trails-list
      v-if="!selectedTrail"
      class="TrailsList_test"
      @editTrail="editTrail"
    />
    <trail-editor
      v-else-if="!selectedStation"
      class="TrailEditor_test"
      :trail-id="selectedTrail"
      @editStation="editStation"
    />
    <station-editor
      v-else
      class="StationEditor_test"
      :station-id="selectedStation"
      :trail-id="selectedTrail"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import EditorFastAccess from './EditorFastAccess'
import TrailsList from './TrailsList/TrailsList'
import TrailEditor from './TrailEditor/TrailEditor'
import StationEditor from './StationEditor/StationEditor'

export default {
  name: 'Editor',
  components: {
    EditorFastAccess,
    TrailsList,
    TrailEditor,
    StationEditor
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail',
      getStation: 'editor/getStation'
    }),
    trailExists () {
      const trailId = this.$route.params.trailId
      return !!this.getTrail({ trailId })
    },
    stationExists () {
      const trailId = this.$route.params.trailId
      const stationId = this.$route.params.stationId
      if (this.trailExists) return !!this.getStation({ trailId, stationId })
      else return false
    },
    selectedTrail () {
      const trailId = this.$route.params.trailId
      if (this.trailExists) return trailId
      else return undefined
    },
    selectedStation () {
      const stationId = this.$route.params.stationId
      if (this.stationExists) return stationId
      else return undefined
    }
  },
  watch: {
    $route (to, from) {
      if (from.params.trailId) this.unbindStations({ trailId: from.params.trailId })
      if (to.params.trailId) this.bindStations({ trailId: to.params.trailId })
    }
  },
  mounted () {
    this.bindMyTrails()
    const trailId = this.$route.params.trailId
    if (trailId) this.bindStations({ trailId })
  },
  beforeDestroy () {
    this.unbindMyTrails()
    const trailId = this.$route.params.trailId
    if (trailId) this.unbindStations({ trailId })
  },
  methods: {
    ...mapActions({
      bindMyTrails: 'editor/bindMyTrails',
      unbindMyTrails: 'editor/unbindMyTrails',
      bindStations: 'editor/bindStations',
      unbindStations: 'editor/unbindStations'
    }),
    editTrail (trailId) {
      this.$router.push({
        name: 'trailEditor',
        params: {
          trailId
        }
      })
    },
    editStation (stationId) {
      const trailId = this.$route.params.trailId
      this.$router.push({
        name: 'stationEditor',
        params: {
          trailId,
          stationId
        }
      })
    },
    unselect () {
      this.$router.push({
        name: 'editor',
        params: { }
      })
    }
  }
}
</script>
