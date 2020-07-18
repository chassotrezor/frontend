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
      if (this.row.data.rawHtml) return this.$sanitize(this.row.data.rawHtml)
      else return ''
    }
  },
  methods: {
    emitTextData (event) {
      const newRow = JSON.parse(JSON.stringify(this.row))
      newRow.data.rawHtml = event
      this.$emit('input', newRow)
    }
  }
}
</script>
