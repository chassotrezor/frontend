<template>
  <div>
    <div v-if="playerIsChasing">
      <slot name="clue" />
    </div>
    <div v-else>
      <slot name="chaseInfo" />
      <start-chase
        v-if="isChaseEntry"
      />
    </div>
  </div>
</template>

<script>
import StartChase from './StartChase'

export default {
  name: 'CluePage',
  components: {
    StartChase
  },
  props: {
    playerIsChasing: Boolean,
    isChaseEntry: Boolean
  }
}
</script>
