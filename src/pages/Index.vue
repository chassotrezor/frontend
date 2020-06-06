<template>
  <q-page class="flex flex-center">
    <q-btn
      label="sign"
      @click="() => $router.push({ name: 'sign' })"
    />
  </q-page>
</template>

<script>export default {
  name: 'PageIndex'
}
</script>
