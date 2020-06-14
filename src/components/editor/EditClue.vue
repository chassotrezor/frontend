<template>
  <div
    @click="edit"
  >
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
  },
  methods: {
    edit () {
      this.$emit('edit', this.clue.id)
    }
  }
}
</script>
