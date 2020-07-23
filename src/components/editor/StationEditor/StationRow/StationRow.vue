<template>
  <div
    class="row no-wrap q-ma-md q-gutter-x-md"
    style="width: 600px"
  >
    <text-row
      v-if="row.type === types.rows.TEXT"
      class="col-grow TextRow_test"
      :row="row"
      :old-row-data="oldRowData"
      @input="$emit('input', $event)"
    />
    <image-row
      v-else-if="row.type === types.rows.IMAGE"
      class="col-grow ImageRow_test"
      :row="row"
      :old-row-data="oldRowData"
      @input="$emit('input', $event)"
      @triggerSave="$emit('triggerSave')"
    />
    <div
      v-else
      class="col-grow"
    >
      {{ row.type }}
    </div>
    <div class="column justify-between full-height">
      <q-btn
        class="moveBtn UpBtn_test"
        icon="keyboard_arrow_up"
        color="primary"
        :disable="first"
        @click="$emit('up')"
      />
      <q-btn
        class="RemoveBtn_test"
        icon="close"
        color="negative"
        @click="$emit('remove')"
      />
      <q-btn
        class="moveBtn DownBtn_test"
        icon="keyboard_arrow_down"
        color="primary"
        :disable="last"
        @click="$emit('down')"
      />
    </div>
  </div>
</template>

<script>
import types from 'src/types'
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
    oldRowData: {
      type: Object,
      default: () => undefined
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

<style lang="sass" scoped>
.moveBtn
  height: 60px
</style>
