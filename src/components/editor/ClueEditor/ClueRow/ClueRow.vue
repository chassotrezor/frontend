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
    <text-row
      v-if="type === 'text'"
      :value="value"
      @input="$emit('input', $event)"
    />
    <div v-else>
      {{ type }}
    </div>
  </div>
</template>

<script>
import TextRow from './TextRow'

export default {
  name: 'ClueRow',
  components: {
    TextRow
  },
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
