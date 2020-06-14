<template>
  <div>
    <edit-chase
      v-for="chase in myChases"
      :key="chase.id"
      class="EditChase_test"
      :name="chase.name"
      @open="emitOpen(chase.id)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EditChase from './EditChase'

export default {
  name: 'MyChases',
  components: {
    EditChase
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
