<template>
  <div>
    chase summary <br>
    {{ chaseId }}
  </div>
</template>

<script>
export default {
  name: 'ChaseSummary',
  props: {
    chaseId: {
      type: String,
      required: true
    }
  }
}
</script>
