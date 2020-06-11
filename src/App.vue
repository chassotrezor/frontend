<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      unsubscribeAuthStateListener: () => {}
    }
  },
  mounted () {
    const vm = this
    vm.unsubscribeAuthStateListener = firebase.auth().onAuthStateChanged(() => {
      vm.unbind()
      vm.bind()
    })
  },
  beforeDestroy () {
    this.unsubscribeAuthStateListener()
    this.unbind()
  },
  methods: {
    ...mapActions({
      bind: 'user/bindUser',
      unbind: 'user/unbindUser'
    })
  }
}
</script>
