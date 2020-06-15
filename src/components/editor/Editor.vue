<template>
  <div>
    <my-chases
      v-if="!selectedChase"
      class="MyChases_test"
      @open="openChase"
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

import MyChases from './MyChases'
import ChaseEditor from './ChaseEditor'
import ClueEditor from './ClueEditor'

export default {
  name: 'Editor',
  components: {
    MyChases,
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
      const chaseId = this.$route.params.selectedChase
      const clueId = this.$route.params.selectedClue
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
  mounted () {
    this.bindMyChases()
  },
  beforeDestroy () {
    this.unbindMyChases()
  },
  methods: {
    ...mapActions({
      bindMyChases: 'editor/bindMyChases',
      unbindMyChases: 'editor/unbindMyChases'
    }),
    openChase (chaseId) {
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
    }
  }
}
</script>
