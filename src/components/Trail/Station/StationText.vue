<template>
  <div v-html="sanitizedRawHtml" />
</template>

<script>
export default {
  name: 'StationText',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    sanitizedRawHtml () {
      return this.$sanitize(this.row.data.rawHtml)
    }
  }
}
</script>
