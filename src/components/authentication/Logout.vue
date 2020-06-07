<template>
  <spinner-with-message
    :message="$t('auth.loggingOut')"
  />
</template>

<script>
import firebase from 'firebase/app'
import SpinnerWithMessage from 'components/Navigation/SpinnerWithMessage'

export default {
  name: 'Logout',
  components: {
    SpinnerWithMessage
  },
  mounted () {
    firebase.auth().signOut()
  }
}
</script>
