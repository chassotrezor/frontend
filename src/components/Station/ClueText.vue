<template>
  <div v-html="sanitizedText" />
</template>

<script>
export default {
  name: 'ClueText',
  props: {
    text: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    sanitizedText () {
      return this.$sanitize(this.text)
    }
  }
}
</script>
