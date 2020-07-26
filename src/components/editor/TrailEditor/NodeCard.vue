<template>
  <div>
    <div v-if="node.type === types.nodes.STATION">
      <div class="row justify-between no-wrap">
        <q-btn
          class="EditBtn_test col-6"
          icon="edit"
          color="lighter"
          text-color="dark"
          padding="xs"
          @click="$emit('editStation')"
        />
        <q-btn
          class="Remove_test col-4"
          icon="delete_forever"
          color="negative"
          text-color="lighter"
          padding="xs"
          :disable="first && last"
          @click="$emit('removeStation')"
        />
      </div>
      <q-input
        class="NameInput_test"
        :value="node.name"
        @input="$emit('inputName', $event)"
      />
      <div class="row no-wrap">
        <q-btn
          class="MoveBefore_test"
          flat
          color="dark"
          padding="sm"
          icon="navigate_before"
          :disable="first"
          @click="$emit('move:before')"
        />
        <q-icon
          name="sync_alt"
          size="xl"
          color="dark"
        />
        <q-btn
          class="MoveAfter_test"
          flat
          color="dark"
          padding="sm"
          icon="navigate_next"
          :disable="last"
          @click="$emit('move:after')"
        />
      </div>
      <div class="row no-wrap">
        <q-btn
          class="AddBefore_test"
          flat
          color="dark"
          padding="sm"
          icon="navigate_before"
          @click="$emit('newStation:before')"
        />
        <q-icon
          name="add_circle"
          size="xl"
          color="dark"
        />
        <q-btn
          class="AddAfter_test"
          flat
          color="dark"
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
