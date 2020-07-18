<template>
  <div class="q-ma-md">
    <q-btn
      class="RemoveBtn_test"
      round
      icon="close"
      color="negative"
      @click="$emit('remove')"
    />
    <q-btn
      class="UpBtn_test"
      round
      icon="keyboard_arrow_up"
      color="primary"
      :disable="first"
      @click="$emit('up')"
    />
    <q-btn
      class="DownBtn_test"
      round
      icon="keyboard_arrow_down"
      color="primary"
      :disable="last"
      @click="$emit('down')"
    />
    <text-row
      v-if="row.type === 'text'"
      class="TextRow_test"
      :row="row"
      @input="$emit('input', $event)"
    />
    <image-row
      v-else-if="row.type === 'image'"
      class="ImageRow_test"
      :row="row"
      @input="$emit('input', $event)"
    />
    <div v-else>
      {{ type }}
    </div>
  </div>
</template>

<script>
import TextRow from './TextRow'
import ImageRow from './ImageRow'

export default {
  name: 'StationRow',
  components: {
    TextRow,
    ImageRow
  },
  props: {
    row: {
      type: Object,
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
