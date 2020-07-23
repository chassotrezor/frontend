<template>
  <div
    class="full-width column items-center q-gutter-y-sm"
  >
    <div>{{ trailName }}</div>
    <div>{{ stationName }}</div>
    <div
      v-for="row in rows"
      :key="row.rowId"
      class="full-width column items-center"
    >
      <station-image
        v-if="row.type === types.rows.IMAGE"
        class="StationImage_test"
        :row="row"
      />
      <station-text
        v-if="row.type === types.rows.TEXT"
        class="StationText_test"
        :row="row"
      />
    </div>
  </div>
</template>

<script>
import StationImage from './StationImage'
import StationText from './StationText'
import types from 'src/types'

export default {
  name: 'StationRenderer',
  components: {
    StationImage,
    StationText
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
