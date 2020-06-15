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
    <edit-clue
      v-for="clue in chase.chaseScheme"
      :key="clue.id"
      class="EditClue_test"
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import EditClue from './EditClue'

export default {
  name: 'ChaseEditor',
  components: {
    EditClue
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
    }
  },
  mounted () {
    this.name = this.chase.name
    this.bindClues({ chaseId: this.chaseId })
  },
  methods: {
    ...mapActions({
      updateChase: 'editor/updateChase',
      createClue: 'editor/createClue',
      bindClues: 'editor/bindClues'
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
