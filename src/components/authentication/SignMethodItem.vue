<template>
  <q-item
    v-ripple
    clickable
    @click.native="$emit('click')"
  >
    <q-item-section>
      {{ name }}
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'SignMethodItem',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
