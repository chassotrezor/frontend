<template>
  <q-editor
    :value="$sanitize(value)"
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
  }
}
</script>
