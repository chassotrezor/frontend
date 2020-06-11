<template>
  <div>
    <div>Title</div>
    <div
      v-for="row in clue.rows"
      :key="row.value"
    >
      <clue-text
        v-if="row.type === 'text'"
        class="clueText_test"
        :raw-html="row.value"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ClueText from './ClueText'

export default {
  name: 'Clue',
  components: {
    ClueText
  },
  computed: {
    ...mapGetters({
      getClue: 'chase/getClue'
    }),
    clue () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      return this.getClue({ chaseId, clueId })
    }
  }
}
</script>
