<template>
  <div v-html="sanitizedRawHtml" />
</template>

<script>
export default {
  name: 'ClueText',
  props: {
    rawHtml: {
      type: String,
      required: true
    }
  },
  computed: {
    sanitizedRawHtml () {
      return this.$sanitize(this.rawHtml)
    }
  }
}
</script>
