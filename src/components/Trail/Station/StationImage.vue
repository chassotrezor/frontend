<template>
  <q-img
    class="QImg_test"
    :src="row.data.url"
  />
</template>

<script>
export default {
  name: 'StationImage',
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>
