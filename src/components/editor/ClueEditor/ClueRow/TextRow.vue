<template>
  <q-editor
    class="QEditor_test"
    :value="sanitizedText"
    @input="$emit('input', { rawHtml: $event })"
  />
</template>

<script>
export default {
  name: 'TextRow',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    sanitizedText () {
      return this.$sanitize(this.value.rawHtml)
    }
  }
}
</script>
