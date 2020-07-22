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
      :label="$t('editor.createTrail')"
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
    async createAndEditTrail () {
      // TODO: set position to navigator position or (0, 0)
      const position = this.$geo.point(46.788520179927225, 7.121350765228272)
      const trailId = await this.createTrail({ position })
      this.edit(trailId)
    }
  }
}
</script>
