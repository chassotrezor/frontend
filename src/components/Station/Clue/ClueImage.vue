<template>
  <q-img
    class="QImg_test"
    :src="src"
  />
</template>

<script>
export default {
  name: 'ClueImage',
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>
