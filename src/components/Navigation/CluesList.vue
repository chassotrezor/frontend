<template>
  <div>
    Clues List
    <div
      v-if="hasChases"
    >
      <q-select
        v-model="selectedChase"
        class="QSelect_test"
        :options="chases"
      />
      <q-list>
        <q-item
          v-for="clue in clues"
          :key="clue"
          class="QItem_test"
          clickable
          @click="() => push(clue)"
        >
          <q-item-section>
            <q-item-label>
              {{ clue }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>
      no clue yet
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CluesList',
  data () {
    return {
      selectedChase: undefined
    }
  },
  computed: {
    ...mapGetters({
      accessibleClues: 'user/accessibleClues',
      lastChase: 'user/lastChase'
    }),
    chases () {
      if (this.accessibleClues) {
        return Object.entries(this.accessibleClues).map(chase => {
          return {
            label: chase[1].data.name,
            value: chase[0]
          }
        })
      } else {
        return []
      }
    },
    clues () {
      if (
        this.selectedChase &&
        this.accessibleClues &&
        this.accessibleClues[this.selectedChase.value] &&
        this.accessibleClues[this.selectedChase.value].clues
      ) {
        return Object.keys(this.accessibleClues[this.selectedChase.value].clues)
      } else {
        return undefined
      }
    },
    hasChases () {
      return Object.keys(this.chases).length > 0
    }
  },
  mounted () {
    const vm = this
    vm.selectedChase = vm.chases.find(option => option.value === vm.lastChase)
  },
  methods: {
    push (clue) {
      const route = {
        name: 'clue',
        params: {
          chaseId: this.selectedChase,
          clueId: clue
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
