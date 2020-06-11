<template>
  <div>
    <div v-if="clue">
      <clue
        v-if="playerIsChasing"
        class="Clue_test"
      />
      <div v-else>
        <chase-info
          class="ChaseInfo_test"
        />
        <start-chase
          v-if="clue.isChaseEntry"
          class="StartChase_test"
        />
      </div>
    </div>
    <spinner-with-message
      v-else
      class="SpinnerWithMessage_test"
      :message="$t('chase.clue.waitForClue')"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChaseInfo from './ChaseInfo'
import Clue from './Clue/Clue'
import SpinnerWithMessage from 'components/Navigation/SpinnerWithMessage'
import StartChase from './StartChase'

export default {
  name: 'StationLayout',
  components: {
    ChaseInfo,
    Clue,
    SpinnerWithMessage,
    StartChase
  },
  computed: {
    ...mapGetters({
      getClue: 'chase/getClue',
      openedChases: 'user/openedChases'
    }),
    clue () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      return this.getClue({ chaseId, clueId })
    },
    playerIsChasing () {
      const chaseId = this.$route.params.chaseId
      if (this.openedChases) return this.openedChases.some(id => id === chaseId)
      else return false
    }
  },
  mounted () {
    const chaseId = this.$route.params.chaseId
    const clueId = this.$route.params.clueId
    this.downloadClue({ chaseId, clueId })
  },
  methods: {
    ...mapActions({
      downloadClue: 'chase/downloadClue'
    })
  }
}
</script>
