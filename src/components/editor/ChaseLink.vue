<template>
  <div
    @click="openChase"
  >
    {{ name }}
  </div>
</template>

<script>
export default {
  name: 'ChaseLink',
  props: {
    chaseId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    openChase () {
      this.$emit('open', this.chaseId)
    }
  }
}
</script>
