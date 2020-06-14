<template>
  <div>
    {{ name }}
  </div>
</template>

<script>
export default {
  name: 'ChaseLink',
  props: {
    name: {
      type: String,
      default: () => ''
    }
  }
}
</script>
