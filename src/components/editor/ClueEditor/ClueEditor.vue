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
      :first="index === 0"
      :last="index === rows.length - 1"
      @up="up(index)"
      @down="down(index)"
      @remove="removeRow(index)"
      @input="set(index, $event)"
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
import ClueRow from './ClueRow/ClueRow'

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
    const vm = this
    vm.name = vm.clue.name
    vm.clue.rows.forEach((row, rowIndex) => {
      Object.entries(row).forEach(entry => {
        if (!vm.rows[rowIndex]) vm.$set(vm.rows, rowIndex, {})
        vm.$set(vm.rows[rowIndex], entry[0], entry[1])
      })
    })
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
        value: '<div>TEXT</div>' + Math.ceil(Math.random() * 100)
      })
    },
    removeRow (i) {
      this.rows.splice(i, 1)
    },
    up (i) {
      const row = this.rows[i]
      const previousRow = this.rows[i - 1]
      this.rows.splice(i - 1, 2, row, previousRow)
    },
    down (i) {
      const row = this.rows[i]
      const nextRow = this.rows[i + 1]
      this.rows.splice(i, 2, nextRow, row)
    },
    set (index, value) {
      this.rows[index].value = value
    }
  }
}
</script>
