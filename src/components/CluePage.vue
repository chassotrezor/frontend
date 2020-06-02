<template>
  <div>
    <slot
      name="clue"
      v-if="playerIsChasing" />
    <div v-else>
      <slot name="chaseInfo" />
      <div v-if="isChaseEntry">Enter Chase</div>
      <q-btn />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CluePage',
  props: {
    playerIsChasing: Boolean,
    isChaseEntry: Boolean
  }
}
</script>
