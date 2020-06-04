<template>
  <q-page class="flex flex-center">
    <authentication />
  </q-page>
</template>

<script>
import Authentication from 'components/authentication/Authentication'

export default {
  name: 'PageIndex',
  components: {
    Authentication
  },
  data () {
    return {
      // playerIsChasing: false
    }
  }
}
</script>
