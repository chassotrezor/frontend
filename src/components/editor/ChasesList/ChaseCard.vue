<template>
  <div>
    <div
      class="
        cursor-pointer
        bg-grey-4
        q-pa-sm
        ClickToOpen_test
      "
      @click="edit"
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ChaseCard',
  props: {
    chaseId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getChase: 'editor/getChase'
    }),
    chase () {
      return this.getChase({ chaseId: this.chaseId })
    }
  },
  methods: {
    ...mapActions({
      deleteChase: 'editor/deleteChase'
    }),
    edit () {
      this.$emit('edit')
    }
  }
}
</script>
