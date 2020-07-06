<template>
  <div>
    <editor-fast-access
      class="EditorFastAccess_test"
      :selected-trail="selectedTrail"
      :selected-clue="selectedClue"
      @editTrail="editTrail"
      @editClue="editClue"
      @unselect="unselect"
    />
    <trails-list
      v-if="!selectedTrail"
      class="TrailsList_test"
      @editTrail="editTrail"
    />
    <trail-editor
      v-else-if="!selectedClue"
      class="TrailEditor_test"
      :trail-id="selectedTrail"
      @editClue="editClue"
    />
    <clue-editor
      v-else
      class="ClueEditor_test"
      :clue-id="selectedClue"
      :trail-id="selectedTrail"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import EditorFastAccess from './EditorFastAccess'
import TrailsList from './TrailsList/TrailsList'
import TrailEditor from './TrailEditor/TrailEditor'
import ClueEditor from './ClueEditor/ClueEditor'

export default {
  name: 'Editor',
  components: {
    EditorFastAccess,
    TrailsList,
    TrailEditor,
    ClueEditor
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail',
      getClue: 'editor/getClue'
    }),
    trailExists () {
      const trailId = this.$route.params.trailId
      return !!this.getTrail({ trailId })
    },
    clueExists () {
      const trailId = this.$route.params.trailId
      const clueId = this.$route.params.clueId
      if (this.trailExists) return !!this.getClue({ trailId, clueId })
      else return false
    },
    selectedTrail () {
      const trailId = this.$route.params.trailId
      if (this.trailExists) return trailId
      else return undefined
    },
    selectedClue () {
      const clueId = this.$route.params.clueId
      if (this.clueExists) return clueId
      else return undefined
    }
  },
  watch: {
    $route (to, from) {
      if (from.params.trailId) this.unbindClues({ trailId: from.params.trailId })
      if (to.params.trailId) this.bindClues({ trailId: to.params.trailId })
    }
  },
  mounted () {
    this.bindMyTrails()
    const trailId = this.$route.params.trailId
    if (trailId) this.bindClues({ trailId })
  },
  beforeDestroy () {
    this.unbindMyTrails()
    const trailId = this.$route.params.trailId
    if (trailId) this.unbindClues({ trailId })
  },
  methods: {
    ...mapActions({
      bindMyTrails: 'editor/bindMyTrails',
      unbindMyTrails: 'editor/unbindMyTrails',
      bindClues: 'editor/bindClues',
      unbindClues: 'editor/unbindClues'
    }),
    editTrail (trailId) {
      this.$router.push({
        name: 'trailEditor',
        params: {
          trailId
        }
      })
    },
    editClue (clueId) {
      const trailId = this.$route.params.trailId
      this.$router.push({
        name: 'clueEditor',
        params: {
          trailId,
          clueId
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
