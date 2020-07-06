<template>
  <div>
    <div>Title</div>
    <div
      v-for="row in clue.rows"
      :key="row.rowId"
    >
      <clue-image
        v-if="row.type === 'image'"
        class="ClueImage_test"
        :src="row.url"
      />
      <clue-text
        v-if="row.type === 'text'"
        class="ClueText_test"
        :raw-html="row.rawHtml"
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
      getClue: 'trail/getClue'
    }),
    clue () {
      const trailId = this.$route.params.trailId
      const clueId = this.$route.params.clueId
      return this.getClue({ trailId, clueId })
    }
  },
  mounted () {
    const trailId = this.$route.params.trailId
    const clueId = this.$route.params.clueId
    this.saveClueAccess({ trailId, clueId })
  },
  methods: {
    ...mapActions({
      saveClueAccess: 'trail/saveClueAccess'
    })
  }
}
</script>
