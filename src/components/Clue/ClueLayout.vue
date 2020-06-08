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
    <q-btn @click="setClueData" />
    {{ clue }}
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
    clue () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      return this.$store.getters['chase/getClue']({ chaseId, clueId })
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
    }),
    setClueData () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      this.clueData = this.$store.getters['chase/getClue']({ chaseId, clueId })
    }
  }
}
</script>
