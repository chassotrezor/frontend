<template>
  <div>
    <div v-if="playerIsChasing">
      <slot name="clue" />
    </div>
    <div v-else>
      <slot name="chaseInfo" />
      <join-chase v-if="isChaseEntry" />
    </div>
  </div>
</template>

<script>
import JoinChase from './JoinChase'

export default {
  name: 'CluePage',
  components: {
    JoinChase
  },
  props: {
    playerIsChasing: Boolean,
    isChaseEntry: Boolean
  }
}
</script>
