<template>
  <q-page class="flex flex-center">
    <editor />
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import Editor from 'components/editor/Editor'

export default {
  name: 'PageEditor',
  components: {
    Editor
  },
  methods: {
    ...mapActions({
      delegateRouteGuard: 'editor/delegateRouteGuard'
    })
  },
  beforeRouteUpdate (to, from, next) {
    const action = 'routeUpdate'
    if (this.$route.params.trailId) this.delegateRouteGuard({ action, next })
    else next()
  },
  beforeRouteLeave (to, from, next) {
    const action = 'routeLeave'
    if (this.$route.params.trailId) this.delegateRouteGuard({ action, next })
    else next()
  }
}
</script>
