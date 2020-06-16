<template>
  <div>
    <div
      class="
        ClickToEdit_test
        cursor-pointer
        bg-grey-4
        q-pa-sm
        q-mb-sm
      "
      @click="edit"
    >
      {{ clue.name }}
    </div>
    <q-btn
      class="DeleteBtn_test"
      round
      color="negative"
      icon="close"
      @click="deleteClue"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ClueCard',
  props: {
    clue: {
      type: Object,
      required: true
    },
    chaseId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions({
      deleteClueInChase: 'editor/deleteClueInChase'
    }),
    edit () {
      this.$emit('edit', this.clue.id)
    },
    deleteClue () {
      this.deleteClueInChase({
        chaseId: this.chaseId,
        clueId: this.clue.id
      })
    }
  }
}
</script>
