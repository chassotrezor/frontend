<template>
  <div class="row no-wrap q-gutter-md">
    <q-img
      class="QImg_test"
      width="200px"
      height="200px"
      contain
      :src="row.data.url"
    />
    <firebase-uploader
      class="FirebaseUploader_test"
      :path="path"
      :file-id="row.data.fileId ? row.data.fileId : row.rowId"
      @uploaded="emitImageData"
    />
  </div>
</template>

<script>
import FirebaseUploader from 'src/store/FirebaseUploader'

export default {
  name: 'ImageRow',
  components: {
    FirebaseUploader
  },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    path () {
      const trailId = this.$route.params.trailId
      const stationId = this.$route.params.stationId
      return `${trailId}/${stationId}`
    }
  },
  methods: {
    emitImageData (event) {
      this.$emit('input', {
        ...this.row,
        data: {
          ...event
        }
      })
    }
  }
}
</script>
