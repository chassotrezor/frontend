<template>
  <div>
    <my-chases
      v-if="selectedChase === ''"
      class="MyChases_test"
      @open="openChase"
    />
    <chase-summary
      v-else
      class="ChaseSummary_test"
      :chase-id="selectedChase"
      @editClue="editClue"
    />
    <clue-editor
      v-if="selectedClue !== ''"
      class="ClueEditor_test"
      :clue-id="selectedClue"
    />
  </div>
</template>

<script>
import MyChases from './MyChases'
import ChaseSummary from './ChaseSummary'
import ClueEditor from './ClueEditor'

export default {
  name: 'Editor',
  components: {
    MyChases,
    ChaseSummary,
    ClueEditor
  },
  data () {
    return {
      selectedChase: '',
      selectedClue: ''
    }
  },
  methods: {
    openChase (chaseId) {
      this.selectedChase = chaseId
    },
    editClue (clueId) {
      this.selectedClue = clueId
    }
  }
}
</script>
