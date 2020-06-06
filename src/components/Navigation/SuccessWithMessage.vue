<template>
  <div class="flex flex-center">
    <div class="column justify-center items-center q-gutter-y-xl">
      <q-icon
        size="100px"
        color="primary"
        name="check"
      />
      <div class="text-h6">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpinnerWithMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>
