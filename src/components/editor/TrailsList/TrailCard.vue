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
      {{ trail.name }}
    </div>
    <q-btn
      class="DeleteBtn_test"
      round
      icon="close"
      color="negative"
      @click="deleteTrail(trail.id)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TrailCard',
  props: {
    trailId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.trailId })
    }
  },
  methods: {
    ...mapActions({
      deleteTrail: 'editor/deleteTrail'
    }),
    edit () {
      this.$emit('edit')
    }
  }
}
</script>
