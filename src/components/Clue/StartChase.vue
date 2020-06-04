<template>
  <q-btn
    @click="() => start(chaseId)"
  >
    {{ $t('chase.manage.start') }}
  </q-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StartChase',
  props: {
    chaseId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions({
      start: 'chase/start'
    })
  }
}
</script>
