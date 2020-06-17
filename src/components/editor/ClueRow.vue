<template>
  <div>
    <q-btn
      round
      icon="close"
      color="negative"
      @click="$emit('remove')"
    />
    <q-btn
      round
      icon="keyboard_arrow_up"
      color="primary"
      :disable="first"
      @click="$emit('up')"
    />
    <q-btn
      round
      icon="keyboard_arrow_down"
      color="primary"
      :disable="last"
      @click="$emit('down')"
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
    },
    first: {
      type: Boolean,
      default: () => false
    },
    last: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>
