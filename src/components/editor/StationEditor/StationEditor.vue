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
    <station-row
      v-for="(row, index) in rows"
      :key="row.rowId"
      class="StationRow_test"
      :row="row"
      :first="index === 0"
      :last="index === rows.length - 1"
      @up="up(index)"
      @down="down(index)"
      @remove="removeRow(index)"
      @input="set(index, $event)"
    />
    <q-btn-group
      class="AddRow_test"
    >
      <q-btn
        class="AddText_test"
        icon="edit"
        :label="$t('editor.station.addRow.text')"
        @click="addRow('text')"
      />
      <q-btn
        class="AddImage_test"
        icon="image"
        :label="$t('editor.station.addRow.image')"
        @click="addRow('image')"
      />
    </q-btn-group>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import StationRow from './StationRow/StationRow'

export default {
  name: 'StationEditor',
  components: {
    StationRow
  },
  props: {
    stationId: {
      type: String,
      required: true
    },
    trailId: {
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
      getStation: 'editor/getStation'
    }),
    station () {
      return this.getStation({
        trailId: this.trailId,
        stationId: this.stationId
      })
    }
  },
  mounted () {
    const vm = this
    vm.name = vm.station.name
    vm.station.rows.forEach((row, rowIndex) => {
      Object.entries(row).forEach(entry => {
        if (!vm.rows[rowIndex]) vm.$set(vm.rows, rowIndex, {})
        vm.$set(vm.rows[rowIndex], entry[0], entry[1])
      })
    })
  },
  methods: {
    ...mapActions({
      updateStationInTrail: 'editor/updateStationInTrail'
    }),
    update () {
      this.updateStationInTrail({
        trailId: this.trailId,
        stationId: this.stationId,
        newProps: {
          name: this.name,
          rows: this.rows
        }
      })
    },
    addRow (type) {
      let rowId
      do {
        rowId = Math.random().toString(36).substring(2)
      } while (this.rows.some(row => row.rowId === rowId))
      this.rows.push({
        rowId,
        type
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
    set (index, row) {
      this.$set(this.rows, index, row)
    }
  }
}
</script>
