<template>
  <div>
    <div>Title</div>
    <div
      v-for="row in clue.rows"
      :key="row.value"
    >
      <clue-image
        v-if="row.type === 'image'"
        class="ClueImage_test"
        :src="row.value"
      />
      <clue-text
        v-if="row.type === 'text'"
        class="ClueText_test"
        :raw-html="row.value"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ClueImage from './ClueImage'
import ClueText from './ClueText'

export default {
  name: 'Clue',
  components: {
    ClueImage,
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
  },
  mounted () {
    const chaseId = this.$route.params.chaseId
    const clueId = this.$route.params.clueId
    this.saveClueAccess({ chaseId, clueId })
  },
  methods: {
    ...mapActions({
      saveClueAccess: 'chase/saveClueAccess'
    })
  }
}
</script>
