<template>
  <div
    @click="openChase"
  >
    {{ name }}
  </div>
</template>

<script>
export default {
  name: 'EditChase',
  props: {
    name: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    openChase () {
      this.$emit('open')
    }
  }
}
</script>
