<template>
  <div>
    <q-input
      v-model="name"
      class="QInputName_test"
    />
    <q-btn
      class="UpdateBtn_test"
      icon="send"
      color="primary"
      @click="update"
    />
    <clue-row
      v-for="(row, index) in rows"
      :key="`clueRow-${index}`"
      class="ClueRow_test"
      :type="row.type"
      :value="row.value"
      @remove="removeRow(index)"
    />
    <q-btn
      class="AddRow_test"
      icon="add"
      :label="$t('editor.clue.addRow')"
      @click="addRow"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ClueRow from './ClueRow'

export default {
  name: 'ClueEditor',
  components: {
    ClueRow
  },
  props: {
    clueId: {
      type: String,
      required: true
    },
    chaseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: '',
      rows: []
    }
  },
  computed: {
    ...mapGetters({
      getClue: 'editor/getClue'
    }),
    clue () {
      return this.getClue({
        chaseId: this.chaseId,
        clueId: this.clueId
      })
    }
  },
  mounted () {
    this.name = this.clue.name
    this.rows = [...this.clue.rows]
  },
  methods: {
    ...mapActions({
      updateClueInChase: 'editor/updateClueInChase'
    }),
    update () {
      this.updateClueInChase({
        chaseId: this.chaseId,
        clueId: this.clueId,
        newProps: {
          name: this.name,
          rows: this.rows
        }
      })
    },
    addRow () {
      this.rows.push({
        type: 'text',
        value: '<div>TEXT</div>'
      })
    },
    removeRow (i) {
      this.rows.splice(i, 1)
    }
  }
}
</script>
