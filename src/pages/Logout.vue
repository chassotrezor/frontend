<template>
  <q-page class="flex flex-center">
    <logout />
  </q-page>
</template>

<script>
import Logout from 'components/authentication/Logout'

export default {
  name: 'PageLogout',
  components: {
    Logout
  }
}
</script>
