<template>
  <div>
    <chase-card
      v-for="chase in myChases"
      :key="chase.id"
      class="ChaseCard_test"
      :chase="chase"
      @open="emitOpen(chase.id)"
    />
    <q-btn
      class="CreateChase_test"
      icon="add"
      label="create chase"
      @click="createAndEditChase"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChaseCard from './ChaseCard'

export default {
  name: 'ChasesList',
  components: {
    ChaseCard
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
