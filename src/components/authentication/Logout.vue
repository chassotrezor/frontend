<template>
  <div>
    <spinner-with-message
      v-if="state === 'loggingOut'"
      class="SpinnerWithMessage_test"
      :message="$t('auth.loggingOut')"
    />
    <div v-else>
      <success-with-message
        class="SuccessWithMessage_test"
        :message="$t('auth.successfulLogin')"
      />
      <div style="height: 2em" />
      <q-btn
        class="HomeBtn_test"
        :label="$t('navigation.goHome')"
        color="primary"
        @click="$router.push({ name: 'home' })"
      />
    </div>
  </div>
</template>

<script>
import { signOut } from '@firebaseAuth'
import SpinnerWithMessage from 'components/Navigation/SpinnerWithMessage'
import SuccessWithMessage from 'components/Navigation/SuccessWithMessage'

export default {
  name: 'Logout',
  components: {
    SpinnerWithMessage,
    SuccessWithMessage
  },
  data () {
    return {
      state: 'loggingOut'
    }
  },
  async mounted () {
    await signOut()
    this.state = 'loggedOut'
  }
}
</script>
