<template>
  <q-btn
    color="primary"
    no-caps
    size="lg"
    @click="$emit('start')"
  >
    {{ $t('trail.manage.start') }}
  </q-btn>
</template>

<script>export default {
  name: 'StartTrail'
}
</script>
