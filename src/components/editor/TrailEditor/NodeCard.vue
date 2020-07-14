<template>
  <div>
    <div v-if="node.type === types.nodes.STATION">
      <q-btn
        icon="edit"
        text-color="black"
        padding="xs"
        color="grey-2"
        @click="$emit('editStation')"
      />
      <q-input
        :value="node.name"
        @input="$emit('inputName', $event)"
      />
      <q-btn
        class="UpBtn_test"
        round
        icon="keyboard_arrow_up"
        color="primary"
        :disable="first"
        @click="$emit('move:before')"
      />
      <q-btn
        class="DownBtn_test"
        round
        icon="keyboard_arrow_down"
        color="primary"
        :disable="last"
        @click="$emit('move:after')"
      />
      <q-btn
        class="DeleteBtn_test"
        round
        color="negative"
        icon="close"
        @click="$emit('remove')"
      />
      <div class="row no-wrap">
        <q-btn
          class="AddBefore_test"
          flat
          padding="sm"
          icon="navigate_before"
          @click="$emit('newStation:before')"
        />
        <q-icon
          name="add_location"
          size="xl"
        />
        <q-btn
          class="AddAfter_test"
          flat
          icon="navigate_next"
          padding="sm"
          @click="$emit('newStation:after')"
        />
      </div>
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
