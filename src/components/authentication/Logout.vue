<template>
  <spinner-with-message
    :message="$t('auth.loggingOut')"
  />
</template>

<script>
import { signOut } from '@firebaseAuth'
import SpinnerWithMessage from 'components/Navigation/SpinnerWithMessage'

export default {
  name: 'Logout',
  components: {
    SpinnerWithMessage
  },
  mounted () {
    signOut()
  }
}
</script>
