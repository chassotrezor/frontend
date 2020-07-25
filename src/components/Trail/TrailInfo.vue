<template>
  <q-card class="q-ma-md">
    <q-card-section class="text-h4">
      {{ trail.name }}
    </q-card-section>
    <q-card-section class="text-body1 TrailDescription_test">
      <div v-html="$sanitize(trail.description)" />
    </q-card-section>
    <q-separator />
    <q-card-section class="text-body1">
      <div class="row justify-between">
        <div class="text-body1 text-weight-bold">
          {{ $t('trail.manage.duration') }} :
        </div>
        <div class="TrailDuration_test">
          {{ duration }}
        </div>
      </div>
      <div class="row justify-between items-center">
        <div class="text-body1 text-weight-bold">
          {{ $t('trail.manage.physicalEffort') }} :
        </div>
        <q-rating
          class="PhysicalRating_test"
          :value="trail.physicalEffort"
          icon="star"
          size="md"
          readonly
        />
      </div>
      <div class="row justify-between items-center">
        <div class="text-body1 text-weight-bold">
          {{ $t('trail.manage.mentalEffort') }} :
        </div>
        <q-rating
          class="MentalRating_test"
          :value="trail.mentalEffort"
          icon="star"
          size="md"
          readonly
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { renderDuration } from 'src/helpers/dataHelpers'

export default {
  name: 'TrailInfo',
  computed: {
    ...mapGetters({
      getTrail: 'trails/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.$route.params.trailId })
    },
    duration () {
      return renderDuration(this.trail.durationMinutes)
    }
  }
}
</script>
