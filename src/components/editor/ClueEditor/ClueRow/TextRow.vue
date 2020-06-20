<template>
  <q-editor
    class="QEditor_test"
    :value="sanitizedText"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'TextRow',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    sanitizedText () {
      return this.$sanitize(this.value)
    }
  }
}
</script>
