<template>
  <div>
    <div v-if="clue">
      <clue
        v-if="playerIsChasing"
        class="Clue_test"
      />
      <div v-else>
        <trail-info
          class="TrailInfo_test"
        />
        <start-trail
          v-if="clue.isTrailEntry"
          class="StartTrail_test"
        />
      </div>
    </div>
    <spinner-with-message
      v-else
      class="SpinnerWithMessage_test"
      :message="$t('trail.clue.waitForClue')"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TrailInfo from './TrailInfo'
import Clue from './Clue/Clue'
import SpinnerWithMessage from 'components/Navigation/SpinnerWithMessage'
import StartTrail from './StartTrail'

export default {
  name: 'StationLayout',
  components: {
    TrailInfo,
    Clue,
    SpinnerWithMessage,
    StartTrail
  },
  computed: {
    ...mapGetters({
      getClue: 'trail/getClue',
      openTrails: 'user/openTrails'
    }),
    clue () {
      const trailId = this.$route.params.trailId
      const clueId = this.$route.params.clueId
      return this.getClue({ trailId, clueId })
    },
    playerIsChasing () {
      const trailId = this.$route.params.trailId
      if (this.openTrails) return this.openTrails.some(id => id === trailId)
      else return false
    }
  },
  mounted () {
    const trailId = this.$route.params.trailId
    const clueId = this.$route.params.clueId
    this.downloadClue({ trailId, clueId })
  },
  methods: {
    ...mapActions({
      downloadClue: 'trail/downloadClue'
    })
  }
}
</script>
