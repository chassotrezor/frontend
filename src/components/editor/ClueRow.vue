<template>
  <div>
    <q-btn
      round
      icon="close"
      color="negative"
      @click="$emit('remove')"
    />
    <div>{{ type }}</div>
    <div>{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'ClueRow',
  props: {
    type: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
}
</script>
