<template>
  <div>
    <spinner-with-message
      v-if="ui === 'waiting'"
      class="spinnerWithMessage_test"
      :message="message"
    />
    <success-with-message
      v-else-if="ui === 'success'"
      class="successWithMessage_test"
      :message="message"
    />
    <q-list
      v-if="ui === 'chooseMethod'"
    >
      <sign-method-item
        class="signMethodItemEmail_test"
        :name="this.$t('auth.email')"
        @click="display('signEmail')"
      />
      <sign-method-item
        class="signMethodItemGoogle_test"
        :name="this.$t('auth.googleAccount')"
        @click="signInWithGoogle"
      />
    </q-list>
    <sign-email
      v-else-if="ui === 'signEmail'"
      class="signEmail_test"
      @back="display('chooseMethod')"
      @email="sendEmailLink"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  getRedirectResult,
  isSignInWithFirebaseEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithGoogle
} from '@firebaseAuth'

import SignMethodItem from './SignMethodItem'
import SuccessWithMessage from 'components/Navigation/SuccessWithMessage'
import SignEmail from './SignEmail'
import SpinnerWithMessage from 'components/Navigation/SpinnerWithMessage'

export default {
  name: 'Sign',
  components: {
    SignMethodItem,
    SuccessWithMessage,
    SignEmail,
    SpinnerWithMessage
  },
  data () {
    return {
      ui: 'waiting',
      message: this.$t('auth.pleaseWait')
    }
  },
  mounted () {
    if (isSignInWithFirebaseEmailLink()) {
      this.checkEmailForSignIn()
    } else {
      this.handleRedirectResult()
    }
  },
  methods: {
    ...mapActions({
      initUser: 'user/initUser'
    }),
    display (ui, message) {
      this.ui = ui
      this.message = message
    },
    sendEmailLink (email) {
      this.display('waiting', this.$t('auth.sendingMail'))
      sendSignInLinkToEmail(email)
        .then(() => {
          this.display('success', this.$t('auth.emailSent'))
          localStorage.setItem('emailForSignIn', email)
        })
        .catch(error => console.error(error))
    },
    checkEmailForSignIn () {
      const email = localStorage.getItem('emailForSignIn')
      if (email) {
        this.signInWithEmailLink(email)
      } else {
        this.enterEmailForSignIn()
      }
    },
    signInWithEmailLink (email) {
      const vm = this
      signInWithEmailLink(email)
        .then(result => {
          localStorage.removeItem('emailForSignIn')
          vm.display('success', vm.$t('auth.connected'))
          vm.initUser({ userId: result.user.uid })
        })
        .catch(error => {
          // TODO: handle errors
          console.error(error)
        })
    },
    enterEmailForSignIn () {
      const vm = this
      vm.$q.dialog({
        title: vm.$t('auth.noEmailForSignIn'),
        message: vm.$t('auth.pleaseEnterEmailForSignIn'),
        prompt: {
          model: '',
          type: 'email'
        },
        persistent: true
      })
        .onOk(email => {
          vm.signInWithEmailLink(email)
        })
    },
    async handleRedirectResult () {
      const result = await getRedirectResult()
      if (result.user) {
        this.display('success', this.$t('auth.connected'))
        this.initUser({ userId: result.user.uid })
        this.$router.push({ name: 'home' })
      } else {
        this.display('chooseMethod')
      }
    },
    signInWithGoogle () {
      signInWithGoogle()
    }
  }
}
</script>
