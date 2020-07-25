<template>
  <div
    class="full-width q-px-sm"
    v-html="sanitizedRawHtml"
  />
</template>

<script>
export default {
  name: 'RowText',
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
