<template>
  <div>
    <editor-fast-access
      class="EditorFastAccess_test"
      :selected-chase="selectedChase"
      :selected-clue="selectedClue"
      @editChase="editChase"
      @editClue="editClue"
      @unselect="unselect"
    />
    <chases-list
      v-if="!selectedChase"
      class="ChasesList_test"
      @editChase="editChase"
    />
    <chase-editor
      v-else-if="!selectedClue"
      class="ChaseEditor_test"
      :chase-id="selectedChase"
      @editClue="editClue"
    />
    <clue-editor
      v-else
      class="ClueEditor_test"
      :clue-id="selectedClue"
      :chase-id="selectedChase"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import EditorFastAccess from './EditorFastAccess'
import ChasesList from './ChasesList/ChasesList'
import ChaseEditor from './ChaseEditor/ChaseEditor'
import ClueEditor from './ClueEditor/ClueEditor'

export default {
  name: 'Editor',
  components: {
    EditorFastAccess,
    ChasesList,
    ChaseEditor,
    ClueEditor
  },
  computed: {
    ...mapGetters({
      getChase: 'editor/getChase',
      getClue: 'editor/getClue'
    }),
    chaseExists () {
      const chaseId = this.$route.params.chaseId
      return !!this.getChase({ chaseId })
    },
    clueExists () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      if (this.chaseExists) return !!this.getClue({ chaseId, clueId })
      else return false
    },
    selectedChase () {
      const chaseId = this.$route.params.chaseId
      if (this.chaseExists) return chaseId
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
      if (from.params.chaseId) this.unbindClues({ chaseId: from.params.chaseId })
      if (to.params.chaseId) this.bindClues({ chaseId: to.params.chaseId })
    }
  },
  mounted () {
    this.bindMyChases()
    const chaseId = this.$route.params.chaseId
    if (chaseId) this.bindClues({ chaseId })
  },
  beforeDestroy () {
    this.unbindMyChases()
    const chaseId = this.$route.params.chaseId
    if (chaseId) this.unbindClues({ chaseId })
  },
  methods: {
    ...mapActions({
      bindMyChases: 'editor/bindMyChases',
      unbindMyChases: 'editor/unbindMyChases',
      bindClues: 'editor/bindClues',
      unbindClues: 'editor/unbindClues'
    }),
    editChase (chaseId) {
      this.$router.push({
        name: 'chaseEditor',
        params: {
          chaseId
        }
      })
    },
    editClue (clueId) {
      const chaseId = this.$route.params.chaseId
      this.$router.push({
        name: 'clueEditor',
        params: {
          chaseId,
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