<template>
  <div
    class="
      cursor-pointer
      bg-grey-4
      q-pa-sm
      q-mb-sm
    "
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
