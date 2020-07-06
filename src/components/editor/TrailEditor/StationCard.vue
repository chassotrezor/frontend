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
      {{ station.name }}
    </div>
    <q-btn
      class="DeleteBtn_test"
      round
      color="negative"
      icon="close"
      @click="deleteStation"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StationCard',
  props: {
    station: {
      type: Object,
      required: true
    },
    trailId: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions({
      deleteStationInTrail: 'editor/deleteStationInTrail'
    }),
    edit () {
      this.$emit('edit', this.station.id)
    },
    deleteStation () {
      this.deleteStationInTrail({
        trailId: this.trailId,
        stationId: this.station.id
      })
    }
  }
}
</script>
