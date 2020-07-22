<template>
  <q-img
    class="QImg_test"
    :style="`width: ${row.data.width}%`"
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
  },
  mounted () {
    console.log(this.row)
  }
}
</script>
