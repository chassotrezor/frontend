<template>
  <q-btn
    @click="$emit('start')"
  >
    {{ $t('trail.manage.start') }}
  </q-btn>
</template>

<script>export default {
  name: 'StartTrail'
}
</script>
