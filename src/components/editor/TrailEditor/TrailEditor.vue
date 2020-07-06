<template>
  <div>
    <q-input v-model="name" />
    <q-btn
      class="UpdateBtn_test"
      icon="send"
      color="primary"
      @click="updateTrail({ trailId, newProps: { name } })"
    />
    <br>
    <div>Clues :</div>
    <clue-card
      v-for="clue in trail.trailScheme"
      :key="clue.id"
      class="ClueCard_test"
      :clue="clue"
      :trail-id="trailId"
      @edit="editClue"
    />
    <q-btn
      class="CreateClue_test"
      icon="add"
      label="nouvel indice"
      @click="createAndEditClue"
    />
    <qr-codes-generator
      :trail-id="trailId"
      :trail-name="trail.name"
      :trail-scheme="trail.trailScheme"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ClueCard from './ClueCard'
import QrCodesGenerator from './QrCodesGenerator'

export default {
  name: 'TrailEditor',
  components: {
    ClueCard,
    QrCodesGenerator
  },
  props: {
    trailId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.trailId })
    },
    clueIds () {
      return Object.values(this.trail.trailScheme).map(clue => clue.id)
    }
  },
  mounted () {
    this.name = this.trail.name
  },
  methods: {
    ...mapActions({
      updateTrail: 'editor/updateTrail',
      createClue: 'editor/createClue'
    }),
    async createAndEditClue () {
      const trailId = this.trailId
      const clueId = await this.createClue({ trailId })
      this.editClue(clueId)
    },
    editClue (clueId) {
      this.$emit('editClue', clueId)
    }
  }
}
</script>
