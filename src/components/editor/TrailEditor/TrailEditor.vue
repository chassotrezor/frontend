<template>
  <div class="full-width">
    <update-btn
      class="UpdateBtn_test"
      :old-data="{ graph: trail.graph, name: trail.name }"
      :new-data="{ graph, name }"
      :update-fn="updateTrailWithPosition"
      :cancel-fn="() => duplicateTrail(trail)"
    />
    <q-input v-model="name" />
    <br>
    <trail-graph
      class="TrailGraph_test"
      :graph="graph"
      @updateName="updateName"
      @updateGraph="updateGraph"
      @editStation="editStation($event)"
      @createStation="promptSaveBefore('updateTrailAndCreateStation', $event)"
      @removeStation="promptSaveBefore('removeStation', $event)"
    />
    <qr-codes-generator
      class="QrCodesGenerator_test"
      :trail-id="trailId"
      :trail-name="trail.name"
      :trail-nodes="trail.graph.nodes"
    />
    <q-dialog
      v-model="dialog.open"
      persistent
    >
      <q-card>
        <q-card-section class="text-h6">
          {{ $t('editor.unsavedChanges') }}
        </q-card-section>
        <q-card-actions class="column items-center q-gutter-md">
          <q-btn
            class="OkBtn_test"
            color="primary"
            no-caps
            :label="dialog.okBtn.label"
            @click="dialog.okBtn.method"
          />
          <q-btn
            color="primary"
            no-caps
            :label="dialog.cancelBtn.label"
            @click="dialog.cancelBtn.method"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import TrailGraph from './TrailGraph'
import QrCodesGenerator from './QrCodesGenerator'
import UpdateBtn from '../UpdateBtn'

export default {
  name: 'TrailEditor',
  components: {
    TrailGraph,
    QrCodesGenerator,
    UpdateBtn
  },
  props: {
    trailId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: '',
      graph: {
        trailEntries: [],
        endNodes: [],
        nodes: {}
      },
      dialog: {
        open: false,
        okBtn: {
          label: '',
          method: () => {}
        },
        cancelBtn: {
          label: '',
          method: () => {}
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      const trail = this.getTrail({ trailId: this.trailId })
      return trail
    },
    difference () {
      const nameDifference = this.trail.name !== this.name
      const graphDifference = !isEqual(this.trail.graph, this.graph)
      return nameDifference || graphDifference
    }
  },
  watch: {
    trail (newTrail) {
      this.duplicateTrail(newTrail)
    }
  },
  mounted () {
    this.duplicateTrail(this.trail)
  },
  methods: {
    ...mapActions({
      updateTrail: 'editor/updateTrail',
      createStation: 'editor/createStation',
      removeStationInTrail: 'editor/removeStationInTrail'
    }),
    duplicateTrail (trail) {
      const vm = this
      this.name = trail.name
      this.graph.trailEntries = [...trail.graph.trailEntries]
      this.graph.endNodes = [...trail.graph.endNodes]
      Object.entries(trail.graph.nodes).forEach(node => {
        vm.$set(vm.graph.nodes, node[0], { ...node[1] })
      })
    },
    updateName ({ stationId, newName }) {
      this.graph.nodes[stationId].name = newName
    },
    updateGraph (graph) {
      this.graph.trailEntries = [...graph.trailEntries]
      this.graph.endNodes = [...graph.endNodes]
      this.graph.nodes = { ...graph.nodes }
    },
    // TODO: when geofirex will be accessible in vuex, replace this with a single transaction
    async updateTrailAndCreateStation ({ newGraph, newStationId }) {
      this.updateGraph(newGraph)
      await this.updateTrailWithPosition()
      return this.createStation({
        trailId: this.trailId,
        stationId: newStationId
      })
    },
    editStation (stationId) {
      this.$emit('editStation', stationId)
    },
    updateTrailWithPosition () {
      const startStationId = this.graph.trailEntries[0]
      const trailGeopoint = this.graph.nodes[startStationId].position
      const position = this.$geo.point(...Object.values(trailGeopoint))
      return this.updateTrail({
        trailId: this.trailId,
        newProps: {
          name: this.name,
          position,
          graph: this.graph
        }
      })
    },
    removeStation ({ removedStationId, updatedGraph }) {
      this.updateGraph(updatedGraph)
      return this.removeStationInTrail({ trailId: this.trailId, removedStationId, updatedGraph })
    },
    promptSaveBefore (methodName, payload) {
      const vm = this
      const method = () => {
        this.dialog.open = false
        return vm[methodName](payload)
      }

      if (this.difference) {
        this.dialog.okBtn.method = method
        this.dialog.cancelBtn.method = () => { vm.dialog.open = false }
        switch (methodName) {
          case 'updateTrailAndCreateStation': {
            this.dialog.okBtn.label = this.$t('editor.trail.saveChangesThenCreateStation')
            this.dialog.cancelBtn.label = this.$t('editor.trail.doNotCreateStation')
            break
          }
          case 'removeStation': {
            this.dialog.okBtn.label = this.$t('editor.trail.saveChangesThenRemoveStation')
            this.dialog.cancelBtn.label = this.$t('editor.trail.doNotRemoveStation')
            break
          }
          default: break
        }
        this.dialog.open = true
      } else {
        method()
      }
    }
  }
}
</script>
