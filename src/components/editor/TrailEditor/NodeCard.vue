<template>
  <div>
    <div v-if="node.type === types.nodes.STATION">
      <div class="row justify-between no-wrap">
        <q-btn
          class="col-6"
          icon="edit"
          text-color="black"
          padding="xs"
          color="grey-2"
          @click="$emit('editStation')"
        />
        <q-btn
          class="DeleteBtn_test col-4"
          icon="delete_forever"
          color="negative"
          padding="xs"
          @click="$emit('remove')"
        />
      </div>
      <q-input
        :value="node.name"
        @input="$emit('inputName', $event)"
      />
      <div class="row no-wrap">
        <q-btn
          class="UpBtn_test"
          flat
          padding="sm"
          icon="navigate_before"
          :disable="first"
          @click="$emit('move:before')"
        />
        <q-icon
          name="sync_alt"
          size="xl"
        />
        <q-btn
          class="DownBtn_test"
          flat
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
          padding="sm"
          icon="navigate_before"
          @click="$emit('newStation:before')"
        />
        <q-icon
          name="add_circle"
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
