<template>
  <div class="row no-wrap content-center q-ma-xs">
    <div class="col-3 column justify-center">
      <div class="text-weight-bold">
        {{ name }}
      </div>
    </div>
    <q-linear-progress
      class="col-8"
      :value="value"
    />
    <q-icon
      v-if="value === 1"
      class="col-1"
      name="check"
      size="md"
    />
    <q-icon
      v-else
      class="col-1"
      name="close"
      size="md"
    />
  </div>
</template>

<script>
export default {
  name: 'AppProgress',
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }
}
</script>
