<template>
  <q-btn
    @click="start(chaseId)"
  >
    {{ $t('chase.manage.start') }}
  </q-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StartChase',
  computed: {
    chaseId () {
      return this.$route.params.chaseId
    }
  },
  methods: {
    ...mapActions({
      start: 'chase/start'
    })
  }
}
</script>
