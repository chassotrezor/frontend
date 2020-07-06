<template>
  <div>
    Clues List
    <div
      v-if="hasTrails"
    >
      <q-select
        v-model="selectedTrail"
        class="QSelect_test"
        :options="trails"
      />
      <q-list>
        <q-item
          v-for="clue in clues"
          :key="clue"
          class="QItem_test"
          :class="`${clue}_test`"
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
      selectedTrail: undefined
    }
  },
  computed: {
    ...mapGetters({
      accessibleClues: 'user/accessibleClues',
      lastTrail: 'user/lastTrail'
    }),
    trails () {
      if (this.accessibleClues) {
        return Object.entries(this.accessibleClues).map(trail => {
          return {
            label: trail[1].data.name,
            value: trail[0]
          }
        })
      } else {
        return []
      }
    },
    clues () {
      if (
        this.selectedTrail &&
        this.accessibleClues &&
        this.accessibleClues[this.selectedTrail.value] &&
        this.accessibleClues[this.selectedTrail.value].clues
      ) {
        return Object.keys(this.accessibleClues[this.selectedTrail.value].clues)
      } else {
        return undefined
      }
    },
    hasTrails () {
      return Object.keys(this.trails).length > 0
    }
  },
  mounted () {
    const vm = this
    vm.selectedTrail = vm.trails.find(option => option.value === vm.lastTrail)
  },
  methods: {
    push (clue) {
      const route = {
        name: 'clue',
        params: {
          trailId: this.selectedTrail.value,
          clueId: clue
        }
      }
      this.$router.push(route)
    }
  }
}
</script>
