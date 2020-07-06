<template>
  <div
    class="row items-center"
  >
    <q-btn
      class="UnselectBtn_test"
      icon="edit"
      @click="$emit('unselect')"
    />
    <div> > </div>
    <q-select
      class="QSelectTrail_test"
      :value="trail"
      :options="trailsOptions"
      @input="$emit('editTrail', $event.value)"
    />
    <div> > </div>
    <q-select
      v-if="selectedTrail"
      class="QSelectClue_test"
      :value="clue"
      :options="cluesOptions"
      @input="$emit('editClue', $event.value)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EditorFastAccess',
  props: {
    selectedTrail: {
      type: String,
      default: () => undefined
    },
    selectedClue: {
      type: String,
      default: () => undefined
    }
  },
  computed: {
    ...mapGetters({
      myTrails: 'editor/myTrails',
      getTrail: 'editor/getTrail'
    }),
    trailsOptions () {
      return Object.values(this.myTrails).map(trail => {
        return {
          value: trail.id,
          label: trail.name
        }
      })
    },
    cluesOptions () {
      if (this.selectedTrail) {
        const trailScheme = this.getTrail({ trailId: this.selectedTrail }).trailScheme
        return Object.values(trailScheme).map(clue => {
          return {
            value: clue.id,
            label: clue.name
          }
        })
      } else {
        return []
      }
    },
    trail () {
      return this.trailsOptions.find(option => option.value === this.selectedTrail)
    },
    clue () {
      return this.cluesOptions.find(option => option.value === this.selectedClue)
    }
  }
}
</script>
