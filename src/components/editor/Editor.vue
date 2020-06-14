<template>
  <div>
    <my-chases
      v-if="selectedChase === ''"
      class="MyChases_test"
      @open="openChase"
    />
    <chase-editor
      v-else-if="selectedClue === ''"
      class="ChaseEditor_test"
      :chase-id="selectedChase"
      @editClue="editClue"
    />
    <clue-editor
      v-else
      class="ClueEditor_test"
      :clue-id="selectedClue"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
  data () {
    return {
      selectedChase: '',
      selectedClue: ''
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
      this.selectedChase = chaseId
    },
    editClue (clueId) {
      this.selectedClue = clueId
    }
  }
}
</script>
