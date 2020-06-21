<template>
  <image-loader
    :sub-path="subPath"
    :initial-src="value"
    @url="$emit('input', $event)"
  />
</template>

<script>
import ImageLoader from './ImageLoader'

export default {
  name: 'ImageRow',
  components: {
    ImageLoader
  },
  props: {
    value: {
      type: String,
      default: () => null
    }
  },
  computed: {
    subPath () {
      const chaseId = this.$route.params.chaseId
      const clueId = this.$route.params.clueId
      return `${chaseId}/${clueId}`
    }
  }
}
</script>
