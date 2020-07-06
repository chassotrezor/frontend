<template>
  <q-btn
    @click="start({ trailId })"
  >
    {{ $t('trail.manage.start') }}
  </q-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StartTrail',
  computed: {
    trailId () {
      return this.$route.params.trailId
    }
  },
  methods: {
    ...mapActions({
      start: 'trail/start'
    })
  }
}
</script>
