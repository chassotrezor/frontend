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
      class="QSelectChase_test"
      :value="chase"
      :options="chasesOptions"
      @input="$emit('editChase', $event.value)"
    />
    <div> > </div>
    <q-select
      v-if="selectedChase"
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
    selectedChase: {
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
      myChases: 'editor/myChases',
      getChase: 'editor/getChase'
    }),
    chasesOptions () {
      return Object.values(this.myChases).map(chase => {
        return {
          value: chase.id,
          label: chase.name
        }
      })
    },
    cluesOptions () {
      if (this.selectedChase) {
        const chaseScheme = this.getChase({ chaseId: this.selectedChase }).chaseScheme
        return Object.values(chaseScheme).map(clue => {
          return {
            value: clue.id,
            label: clue.name
          }
        })
      } else {
        return []
      }
    },
    chase () {
      return this.chasesOptions.find(option => option.value === this.selectedChase)
    },
    clue () {
      return this.cluesOptions.find(option => option.value === this.selectedClue)
    }
  }
}
</script>
