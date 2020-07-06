<template>
  <q-page class="flex flex-center">
    <stations-list />
  </q-page>
</template>

<script>
import StationsList from 'components/Navigation/StationsList'

export default {
  name: 'PageStationsList',
  components: {
    StationsList
  }
}
</script>
