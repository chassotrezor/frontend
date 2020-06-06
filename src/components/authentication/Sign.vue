<template>
  <div>
    <spinner-with-message
      v-if="ui === 'waiting'"
      :message="message"
    />
    <success-with-message
      v-else-if="ui === 'success'"
      :message="message"
    />
    <q-list
      v-if="ui === 'chooseMethod'"
    >
      <sign-method-item
        :name="this.$t('auth.email')"
        @click="display('signEmail')"
      />
      <sign-method-item
        :name="this.$t('auth.googleAccount')"
        @click="signInWithGoogle"
      />
    </q-list>
    <sign-email
      v-else-if="ui === 'signEmail'"
      @back="display('chooseMethod')"
      @email="sendEmailLink"
    />
  </div>
</template>

<script>
import firebase from 'firebase/app'
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
    if (firebase.auth().isSignInWithEmailLink(location.href)) {
      this.signInWithEmailLink()
    } else {
      this.handleRedirectResult()
    }
  },
  methods: {
    display (ui, message) {
      this.ui = ui
      this.message = message
    },
    sendEmailLink (email) {
      this.display('waiting', this.$t('auth.sendingMail'))
      const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8081/sign/' : 'https://chassotrezor.web.app/sign/'
      const actionCodeSettings = {
        url,
        handleCodeInApp: true
      }
      firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
          this.display('success', this.$t('auth.emailSent'))
          localStorage.setItem('emailForSignIn', email)
        })
        .catch(error => console.error(error))
    },
    signInWithEmailLink () {
      const vm = this
      const email = localStorage.getItem('emailForSignIn')
      if (!email) {
        // email = ... demander à l'utilisateur
      }
      firebase.auth().signInWithEmailLink(email, location.href)
        .then(result => {
          localStorage.removeItem('emailForSignIn')
          vm.display('succes', vm.$t('auth.connected'))
        })
        .catch(error => {
          console.error(error)
        })
    },
    handleRedirectResult () {
      const vm = this
      firebase.auth().getRedirectResult()
        .then(result => {
          if (result.user) {
            vm.display('succes', vm.$t('auth.connected'))
          } else {
            vm.display('chooseMethod')
          }
        })
        .catch(error => console.error(error))
    },
    signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    }
  }
}
</script>
