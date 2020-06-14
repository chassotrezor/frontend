<template>
  <div>
    <edit-chase
      v-for="chase in myChases"
      :key="chase.id"
      class="EditChase_test"
      :chase="chase"
      @open="emitOpen(chase.id)"
    />
    <q-btn
      class="CreateChase_test"
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
      const vm = this
      vm.createChase()
        .then(chaseId => {
          vm.emitOpen(chaseId)
        })
    }
  }
}
</script>
