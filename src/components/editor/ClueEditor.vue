<template>
  <div>
    {{ clueId }}
  </div>
</template>

<script>
export default {
  name: 'ClueEditor',
  props: {
    clueId: {
      type: String,
      required: true
    }
  }
}
</script>
