<template>
  <q-page class="flex flex-center">
    <q-toggle v-model="playerIsChasing" />
    <clue-page :player-is-chasing="playerIsChasing">
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
import CluePage from 'components/CluePage'

export default {
  name: 'PageIndex',
  components: {
    CluePage
  },
  data () {
    return {
      playerIsChasing: false
    }
  }
}
</script>
