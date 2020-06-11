<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { onAuthStateChanged } from '@firebaseAuth'
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
    vm.unsubscribeAuthStateListener = onAuthStateChanged(() => {
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
