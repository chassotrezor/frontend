<template>
  <div>
    <q-editor
      class="QEditor_test"
      :value="sanitizedText"
      @input="emitTextData"
    />
  </div>
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
      const newRow = {
        data: {
          rawHtml: event
        }
      }
      this.$emit('input', newRow)
    }
  }
}
</script>
