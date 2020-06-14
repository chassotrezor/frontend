<template>
  <div>
    <chase-link
      v-for="chase in myChases"
      :key="chase.id"
      class="ChaseLink_test"
      :name="chase.name"
      @open="emitOpen(chase.id)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChaseLink from './ChaseLink'

export default {
  name: 'MyChases',
  components: {
    ChaseLink
  },
  computed: {
    ...mapGetters({
      myChases: 'editor/myChases'
    })
  },
  mounted () {
    this.downloadMyChases()
  },
  methods: {
    ...mapActions({
      downloadMyChases: 'editor/downloadMyChases'
    }),
    emitOpen (chaseId) {
      this.$emit('open', chaseId)
    }
  }
}
</script>
