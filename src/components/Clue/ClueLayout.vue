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
  }
}
</script>
