<template>
  <div>
    <edit-chase
      v-for="chase in myChases"
      :key="chase.id"
      class="EditChase_test"
      :name="chase.name"
      @open="emitOpen(chase.id)"
    />
    <q-btn
      @click="createAndEditChase"
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
  methods: {
    ...mapActions({
      createChase: 'editor/createChase'
    }),
    emitOpen (chaseId) {
      this.$emit('open', chaseId)
    },
    createAndEditChase () {
      return this.createChase()
        .then()
    }
  }
}
</script>
