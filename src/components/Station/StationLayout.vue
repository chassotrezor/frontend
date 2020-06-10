<template>
  <div>
    <clue
      v-if="playerIsChasing"
      class="Clue_test"
    />
    <div v-else>
      <chase-info
        class="ChaseInfo_test"
      />
      <start-chase
        v-if="isChaseEntry"
        class="StartChase_test"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChaseInfo from './ChaseInfo'
import Clue from './Clue'
import StartChase from './StartChase'

export default {
  name: 'ClueLayout',
  components: {
    ChaseInfo,
    Clue,
    StartChase
  },
  props: {
    playerIsChasing: Boolean,
    isChaseEntry: Boolean
  },
  computed: {
    ...mapGetters({
      getClue: 'chase/getClue'
    }),
    clue () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      return this.getClue({ chaseId, clueId })
    }
  },
  mounted () {
    const chaseId = this.$route.params.chaseId
    const clueId = this.$route.params.clueId
    this.downloadClue({ chaseId, clueId })
      .then(() => {
        console.log('get clue ?')
      })
  },
  methods: {
    ...mapActions({
      downloadClue: 'chase/downloadClue'
    })
  }
}
</script>
