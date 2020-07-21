<template>
  <div>
    <q-list>
      <q-item
        v-for="trail in sortedAccessibleTrails"
        :key="trail.trailId"
        class="QItem_test"
      >
        <q-item-section avatar>
          <q-toggle
            class="ToggleDisplay_test"
            :value="trail.display"
            round
            @input="toggleTrailDisplay({ trailId: trail.trailId })"
          />
        </q-item-section>

        <q-item-section>
          {{ trail.name }}
        </q-item-section>

        <q-item-section avatar>
          <q-btn
            class="PickColor_test"
            :style="`color: ${trail.display ? trail.color : 'grey'}`"
            round
            flat
            padding="none"
            size="xl"
            icon="palette"
            :disable="!trail.display"
            @click="editColor(trail.trailId)"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog
      v-model="chooseColor"
    >
      <q-color
        class="ColorPicker_test"
        no-header
        no-footer
        default-view="palette"
        @input="setColorOfEditedTrail"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'HistoryDrawerContent',
  data () {
    return {
      chooseColor: false,
      editedTrail: null
    }
  },
  computed: {
    ...mapGetters({
      sortedAccessibleTrails: 'user/sortedAccessibleTrails'
    })
  },
  methods: {
    ...mapActions({
      toggleTrailDisplay: 'user/toggleTrailDisplay',
      setTrailColor: 'user/setTrailColor'
    }),
    editColor (trailId) {
      this.chooseColor = true
      this.editedTrail = trailId
    },
    setColorOfEditedTrail (color) {
      this.setTrailColor({ trailId: this.editedTrail, color })
      this.chooseColor = false
      this.editedTrail = null
    }
  }
}
</script>
