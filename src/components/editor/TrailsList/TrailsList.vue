<template>
  <div class="full-width column items-center q-gutter-y-xl q-pt-xl">
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
      :label="$t('editor.trailsList.createTrail')"
      no-caps
      size="lg"
      @click="createAndEditTrail"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrailCard from './TrailCard'
import { fromNavigatorPosition } from 'src/helpers/mapHelpers'

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
      navigator.geolocation.getCurrentPosition(
        async navigatorPosition => {
          const positionArray = fromNavigatorPosition(navigatorPosition).toArray()
          const position = this.$geo.point(...positionArray)
          const trailId = await this.createTrail({ position })
          this.edit(trailId)
        },
        async () => {
          const position = this.$geo.point(0, 0)
          const trailId = await this.createTrail({ position })
          this.edit(trailId)
        })
    }
  }
}
</script>
