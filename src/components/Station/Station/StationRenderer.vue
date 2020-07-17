<template>
  <div>
    <div>{{ trailName }}</div>
    <div>{{ stationName }}</div>
    <div
      v-for="row in rows"
      :key="row.rowId"
    >
      <station-image
        v-if="row.type === 'image'"
        class="StationImage_test"
        :src="row.url"
      />
      <station-text
        v-if="row.type === 'text'"
        class="StationText_test"
        :raw-html="row.rawHtml"
      />
    </div>
  </div>
</template>

<script>
import StationImage from './StationImage'
import StationText from './StationText'

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
  }
}
</script>
