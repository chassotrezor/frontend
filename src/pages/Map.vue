<template>
  <q-page
    class="flex flex-center"
  >
    <trails-map />
  </q-page>
</template>

<script>
import TrailsMap from 'components/Navigation/TrailsMap'

export default {
  name: 'PageMap',
  components: {
    TrailsMap
  }
}
</script>
