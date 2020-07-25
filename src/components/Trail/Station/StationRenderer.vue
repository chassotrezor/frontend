<template>
  <div
    class="full-width column items-center q-gutter-y-sm"
  >
    <div class="full-width row justify-between items-baseline q-pa-sm">
      <div class="text-body1 text-weight-bold">
        {{ trailName }}
      </div>
      <div class="text-body1">
        {{ stationName }}
      </div>
      <q-separator />
    </div>
    <div
      v-for="row in rows"
      :key="row.rowId"
      class="full-width column items-center"
    >
      <row-image
        v-if="row.type === types.rows.IMAGE"
        class="StationImage_test"
        :row="row"
      />
      <row-text
        v-if="row.type === types.rows.TEXT"
        class="StationText_test"
        :row="row"
      />
    </div>
  </div>
</template>

<script>
import RowImage from './Rows/RowImage'
import RowText from './Rows/RowText'
import types from 'src/types'

export default {
  name: 'StationRenderer',
  components: {
    RowImage,
    RowText
  },
  props: {
    trailName: {
      type: String,
      required: true
    },
    stationName: {
      type: String,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      types: types
    }
  }
}
</script>
