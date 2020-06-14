<template>
  <div>
    <div>{{ chase.name }}</div>
    <edit-clue
      v-for="(clue, id) in chase.chaseScheme"
      :key="id"
      class="EditClue_test"
      :clue="clue"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditClue from './EditClue'

export default {
  name: 'ChaseSummary',
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
  }
}
</script>
