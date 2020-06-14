<template>
  <div>
    <div>{{ chase.name }}</div>
    <edit-clue
      v-for="clue in chase.chaseScheme"
      :key="clue.id"
      class="EditClue_test"
      :clue="clue"
      @edit="editClue"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditClue from './EditClue'

export default {
  name: 'ChaseEditor',
  components: {
    EditClue
  },
  props: {
    chaseId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getChase: 'editor/getChase'
    }),
    chase () {
      return this.getChase({ chaseId: this.chaseId })
    }
  },
  methods: {
    editClue (clueId) {
      this.$emit('editClue', clueId)
    }
  }
}
</script>
