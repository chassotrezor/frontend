<template>
  <q-page class="flex flex-center">
    <scanner />
    <q-toggle v-model="playerIsChasing" />
    <clue-page
      :player-is-chasing="playerIsChasing"
      is-chase-entry
    >
      <template v-slot:clue>
        <div>
          CLUE
        </div>
      </template>
      <template v-slot:chaseInfo>
        <div>
          CHASE INFO
        </div>
      </template>
    </clue-page>
  </q-page>
</template>

<script>
import CluePage from 'components/Clue/CluePage'
import Scanner from 'components/Scanner/Scanner'

export default {
  name: 'PageIndex',
  components: {
    CluePage,
    Scanner
  },
  data () {
    return {
      playerIsChasing: false
    }
  }
}
</script>
