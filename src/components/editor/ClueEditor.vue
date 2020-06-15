<template>
  <div>
    <q-input
      v-model="name"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ClueEditor',
  props: {
    clueId: {
      type: String,
      required: true
    },
    chaseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters({
      getClue: 'editor/getClue'
    }),
    clue () {
      return this.getClue({
        chaseId: this.chaseId,
        clueId: this.clueId
      })
    }
  },
  mounted () {
    this.name = this.clue.name
  },
  methods: {
    ...mapActions({
      updateClueInChase: 'editor/updateClueInChase'
    })
  }
}
</script>
