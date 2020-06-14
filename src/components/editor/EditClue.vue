<template>
  <div>
    {{ clue.name }}
  </div>
</template>

<script>
export default {
  name: 'EditClue',
  props: {
    clue: {
      type: Object,
      required: true
    }
  }
}
</script>
