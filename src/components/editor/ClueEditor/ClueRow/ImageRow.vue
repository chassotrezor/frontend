<template>
  <div>
    <q-img
      :src="value.url"
    />
    <firebase-uploader
      :path="path"
      :file-id="value.rowId"
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
    value: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    path () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      return `${chaseId}/${clueId}`
    }
  },
  methods: {
    emitImageData (event) {
      this.$emit('input', {
        ...event,
        rowId: event.fileId
      })
    }
  }
}
</script>
