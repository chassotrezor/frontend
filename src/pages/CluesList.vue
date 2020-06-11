<template>
  <q-page class="flex flex-center">
    <clues-list />
  </q-page>
</template>

<script>
import CluesList from 'components/Navigation/CluesList'

export default {
  name: 'PageCluesList',
  components: {
    CluesList
  }
}
</script>
