<template>
  <div>
    <trail-card
      v-for="trail in myTrails"
      :key="trail.id"
      class="TrailCard_test"
      :trail-id="trail.id"
      @edit="edit(trail.id)"
    />
    <q-btn
      class="CreateTrail_test"
      icon="add"
      label="create trail"
      @click="createAndEditTrail"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrailCard from './TrailCard'

export default {
  name: 'TrailsList',
  components: {
    TrailCard
  },
  computed: {
    ...mapGetters({
      myTrails: 'editor/myTrails'
    })
  },
  methods: {
    ...mapActions({
      createTrail: 'editor/createTrail'
    }),
    edit (trailId) {
      this.$emit('editTrail', trailId)
    },
    createAndEditTrail () {
      const vm = this
      vm.createTrail()
        .then(trailId => {
          vm.edit(trailId)
        })
    }
  }
}
</script>
