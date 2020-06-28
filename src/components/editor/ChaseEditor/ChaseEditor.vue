<template>
  <div>
    <q-input v-model="name" />
    <q-btn
      class="UpdateBtn_test"
      icon="send"
      color="primary"
      @click="updateChase({ chaseId, newProps: { name } })"
    />
    <br>
    <div>Clues :</div>
    <clue-card
      v-for="clue in chase.chaseScheme"
      :key="clue.id"
      class="ClueCard_test"
      :clue="clue"
      :chase-id="chaseId"
      @edit="editClue"
    />
    <q-btn
      class="CreateClue_test"
      icon="add"
      label="nouvel indice"
      @click="createAndEditClue"
    />
    <qr-codes-generator
      :chase-id="chaseId"
      :chase-name="chase.name"
      :chase-scheme="chase.chaseScheme"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ClueCard from './ClueCard'
import QrCodesGenerator from './QrCodesGenerator'

export default {
  name: 'ChaseEditor',
  components: {
    ClueCard,
    QrCodesGenerator
  },
  props: {
    chaseId: {
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
      getChase: 'editor/getChase'
    }),
    chase () {
      return this.getChase({ chaseId: this.chaseId })
    },
    clueIds () {
      return Object.values(this.chase.chaseScheme).map(clue => clue.id)
    }
  },
  mounted () {
    this.name = this.chase.name
  },
  methods: {
    ...mapActions({
      updateChase: 'editor/updateChase',
      createClue: 'editor/createClue'
    }),
    async createAndEditClue () {
      const chaseId = this.chaseId
      const clueId = await this.createClue({ chaseId })
      this.editClue(clueId)
    },
    editClue (clueId) {
      this.$emit('editClue', clueId)
    }
  }
}
</script>
