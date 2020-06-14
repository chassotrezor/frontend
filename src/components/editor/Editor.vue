<template>
  <div>
    <my-chases
      v-if="selectedChase === ''"
      class="MyChases_test"
      @open="openChase"
    />
    <chase-summary
      v-else
      class="ChaseSummary_test"
      :chase-id="selectedChase"
    />
  </div>
</template>

<script>
import MyChases from './MyChases'
import ChaseSummary from './ChaseSummary'

export default {
  name: 'Editor',
  components: {
    MyChases,
    ChaseSummary
  },
  data () {
    return {
      selectedChase: ''
    }
  },
  methods: {
    openChase (chaseId) {
      this.selectedChase = chaseId
    }
  }
}
</script>
