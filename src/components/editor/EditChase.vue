<template>
  <div>
    <div
      class="ClickToOpen_test"
      @click="openChase"
    >
      {{ chase.name }}
    </div>
    <q-btn
      class="DeleteBtn_test"
      round
      icon="close"
      color="negative"
      @click="deleteChase(chase.id)"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'EditChase',
  props: {
    chase: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions({
      deleteChase: 'editor/deleteChase'
    }),
    openChase () {
      this.$emit('open')
    }
  }
}
</script>
