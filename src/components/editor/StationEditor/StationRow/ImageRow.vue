<template>
  <div class="column">
    <q-slider
      class="WidthHandler_test"
      :value="width"
      :min="10"
      :max="100"
      @input="updateWidth"
    />
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
        @uploaded="updateFile"
      />
    </div>
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
  data () {
    return {
      width: 100
    }
  },
  computed: {
    path () {
      const trailId = this.$route.params.trailId
      const stationId = this.$route.params.stationId
      return `${trailId}/${stationId}`
    }
  },
  mounted () {
    this.width = this.row.data.width
    this.fileId = this.row.data.fileId
    this.url = this.row.data.url
  },
  methods: {
    emitImageData () {
      this.$emit('input', {
        ...this.row,
        data: {
          width: this.width,
          fileId: this.fileId,
          url: this.url
        }
      })
    },
    updateFile (fileData) {
      this.fileId = fileData.fileId
      this.url = fileData.url
      this.emitImageData()
    },
    updateWidth (width) {
      this.width = width
      this.emitImageData()
    }
  }
}
</script>
