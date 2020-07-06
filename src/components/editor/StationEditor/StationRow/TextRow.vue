<template>
  <q-editor
    class="QEditor_test"
    :value="sanitizedText"
    @input="emitTextData"
  />
</template>

<script>
export default {
  name: 'TextRow',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    sanitizedText () {
      if (this.row.rawHtml) return this.$sanitize(this.row.rawHtml)
      else return ''
    }
  },
  methods: {
    emitTextData (event) {
      this.$emit('input', {
        ...this.row,
        rawHtml: event
      })
    }
  }
}
</script>
