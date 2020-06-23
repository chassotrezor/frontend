<template>
  <div>
    <q-img
      :src="value.url"
    />
    <firebase-uploader
      :path="path"
      :name="value.name"
      @uploaded="$emit('input', $event)"
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
  }
}
</script>
