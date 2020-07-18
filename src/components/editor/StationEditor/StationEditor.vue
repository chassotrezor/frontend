<template>
  <div class="row justify-between full-width">
    <q-page-sticky
      ref="preview"
      position="left"
    >
      <station-preview
        class="StationPreview_test q-ma-md"
        :trail-name="trailName"
        :station-name="stationName"
        :rows="rows"
      />
    </q-page-sticky>
    <div
      class="col-shrink bg-grey-3"
      :style="`width: ${previewWidth}px`"
    />
    <div
      class="col-grow bg-grey-3 column justify-start items-center"
      style="z-index: 10"
    >
      <q-input
        v-model="stationName"
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
          @click="addRow(types.rows.TEXT)"
        />
        <q-btn
          class="AddImage_test"
          icon="image"
          :label="$t('editor.station.addRow.image')"
          @click="addRow(types.rows.IMAGE)"
        />
      </q-btn-group>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import StationRow from './StationRow/StationRow'
import StationPreview from './StationPreview'
import { copyNodes } from 'components/editor/TrailEditor/graphHelpers'
import types from 'src/types'

export default {
  name: 'StationEditor',
  components: {
    StationRow,
    StationPreview
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
      trailName: '',
      stationName: '',
      rows: [],
      previewWidth: 200,
      types: types
    }
  },
  computed: {
    ...mapGetters({
      getStation: 'editor/getStation',
      getTrail: 'editor/getTrail'
    }),
    station () {
      return this.getStation({
        trailId: this.trailId,
        stationId: this.stationId
      })
    },
    trail () {
      return this.getTrail({
        trailId: this.trailId
      })
    }
  },
  mounted () {
    this.trailName = this.trail.name
    this.stationName = this.trail.nodes[this.stationId].name
    // TODO: replace with a smarter deep copy
    this.rows = JSON.parse(JSON.stringify(this.station.rows))
    const vm = this
    this.$nextTick(() => {
      vm.previewWidth = vm.$refs.preview.$el.scrollWidth
    })
  },
  methods: {
    ...mapActions({
      updateStationInTrail: 'editor/updateStationInTrail',
      updateTrail: 'editor/updateTrail'
    }),
    update () {
      this.updateStationInTrail({
        trailId: this.trailId,
        stationId: this.stationId,
        newProps: {
          rows: this.rows
        }
      })
      const nodes = copyNodes(this.trail.nodes)
      nodes[this.stationId].name = this.stationName
      this.updateTrail({
        trailId: this.trailId,
        newProps: {
          name: this.trailName,
          nodes
        }
      })
    },
    addRow (type) {
      let data
      switch (type) {
        case types.rows.IMAGE: data = { url: null }; break
        case types.rows.TEXT: data = { rawHtml: '' }; break
        default: data = {}; break
      }
      let rowId
      do {
        rowId = Math.random().toString(36).substring(2)
      } while (this.rows.some(row => row.rowId === rowId))
      this.rows.push({
        rowId,
        type,
        data
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
