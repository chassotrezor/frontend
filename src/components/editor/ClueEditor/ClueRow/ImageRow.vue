<template>
  <div>
    <q-img
      class="QImg_test"
      :src="row.url"
    />
    <firebase-uploader
      class="FirebaseUploader_test"
      :path="path"
      :file-id="row.fileId ? row.fileId : row.rowId"
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
      const clueId = this.$route.params.clueId
      return `${trailId}/${clueId}`
    }
  },
  methods: {
    emitImageData (event) {
      this.$emit('input', {
        ...this.row,
        ...event
      })
    }
  }
}
</script>
