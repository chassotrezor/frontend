<template>
  <q-img
    class="QImg_test"
    :src="src"
  />
</template>

<script>
export default {
  name: 'StationImage',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>
