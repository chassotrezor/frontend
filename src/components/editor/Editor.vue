<template>
  <div>
    <my-chases
      v-if="selectedChase === ''"
      class="MyChases_test"
      @open="openChase"
    />
    <chase-editor
      v-else
      class="ChaseEditor_test"
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
