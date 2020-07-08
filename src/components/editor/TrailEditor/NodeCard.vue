<template>
  <div>
    <div v-if="node.type === types.nodes.STATION">
      <div
        class="
          ClickToEdit_test
          cursor-pointer
          bg-grey-4
          q-pa-sm
          q-mb-sm
        "
        @click="$emit('editStation')"
      >
        {{ node.name }}
      </div>
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
      <q-btn
        class="DeleteBtn_test"
        round
        color="negative"
        icon="close"
        @click="$emit('remove')"
      />
    </div>

    <div v-else-if="node.type === types.nodes.HINT">
      hint
    </div>

    <div v-else-if="node.type === types.nodes.AND">
      and
    </div>

    <div v-else-if="node.type === types.nodes.OR">
      or
    </div>
  </div>
</template>

<script>
import types from 'src/types'

export default {
  name: 'NodeCard',
  props: {
    node: {
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
  },
  data () {
    return {
      types: types
    }
  }
}
</script>
