<template>
  <div>
    <update-btn
      class="UpdateBtn_test"
      :old-data="{
        graph: trail.graph,
        name: trail.name,
        description: trail.description,
        durationMinutes: trail.durationMinutes,
        physicalEffort: trail.physicalEffort,
        mentalEffort: trail.mentalEffort,
        pdfData: trail.pdfData
      }"
      :new-data="{ graph, name, description, durationMinutes, physicalEffort, mentalEffort, pdfData }"
      :update-fn="updateTrailWithPosition"
      :cancel-fn="() => duplicateTrail(trail)"
    />
    <div class="full-width column items-center q-gutter-md q-mt-md">
      <div
        class="row q-pr-md justify-center q-gutter-md"
      >
        <q-card
          style="width: 400px"
        >
          <q-card-section>
            <q-input
              v-model="name"
              class="InputName_test"
              :label="$t('editor.trail.name')"
            />
          </q-card-section>
          <q-card-section>
            <q-editor
              v-model="description"
              class="InputDescription_test"
              :definitions="{
                label: {
                  label: $t('editor.trail.description'),
                  disable: false
                }
              }"
              :toolbar="[
                ['label'],
                ['bold', 'italic', 'underline']
              ]"
            />
          </q-card-section>
        </q-card>
        <q-card
          class="column justify-around"
          style="width: 400px"
        >
          <q-card-section
            class="row justify-between items-center"
            style="width: 400px"
          >
            <div class="text-body1 text-weight-bold">
              {{ $t('trail.manage.duration') }} :
            </div>
            <q-slider
              v-model="durationMinutes"
              class="InputDuration_test"
              style="width: 240px"
              :min="30"
              :max="480"
              :step="15"
              label
              :label-value="renderedDuration"
              label-always
            />
          </q-card-section>
          <q-card-section
            class="row justify-between items-center"
            style="width: 400px"
          >
            <div class="text-body1 text-weight-bold">
              {{ $t('trail.manage.physicalEffort') }} :
            </div>
            <q-rating
              v-model="physicalEffort"
              class="InputPhysicalEffort_test"
              icon="star"
              size="xl"
            />
          </q-card-section>
          <q-card-section
            class="row justify-between items-center"
            style="width: 400px"
          >
            <div class="text-body1 text-weight-bold">
              {{ $t('trail.manage.mentalEffort') }} :
            </div>
            <q-rating
              v-model="mentalEffort"
              class="InputMentalEffort_test"
              icon="star"
              size="xl"
            />
          </q-card-section>
        </q-card>
      </div>

      <br>
      <trail-graph
        class="TrailGraph_test"
        :graph="graph"
        :center="trail.position.geopoint"
        :zoom="trail.mapData.zoom"
        @update:zoom="mapData.zoom = $event"
        @updateName="updateName"
        @updateGraph="updateGraph"
        @editStation="editStation($event)"
        @createStation="promptSaveBefore('updateTrailAndCreateStation', $event)"
        @removeStation="promptSaveBefore('removeStation', $event)"
      />
      <qr-codes-generator
        class="QrCodesGenerator_test"
        :trail-id="trailId"
        :trail-name="name"
        :graph="graph"
        :pdf-data="pdfData"
        @update:width="pdfData.width = $event"
        @update:light="pdfData.colors.light = $event"
        @update:dark="pdfData.colors.dark = $event"
      />
      <q-dialog
        v-model="dialog.open"
        persistent
      >
        <q-card>
          <q-card-section class="text-h6">
            {{ dialog.title }}
          </q-card-section>
          <q-card-section class="text-body1">
            {{ dialog.message }}
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
  </div>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import TrailGraph from './TrailGraph'
import QrCodesGenerator from './QrCodesGenerator'
import UpdateBtn from '../UpdateBtn'
import { renderDuration } from 'src/helpers/dataHelpers'

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
      description: '',
      durationMinutes: 0,
      physicalEffort: 0,
      mentalEffort: 0,
      graph: {
        trailEntries: [],
        endNodes: [],
        nodes: {}
      },
      dialog: {
        open: false,
        title: '',
        message: '',
        okBtn: {
          label: '',
          method: () => {}
        },
        cancelBtn: {
          label: '',
          method: () => {}
        }
      },
      pdfData: {
        colors: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 50
      },
      mapData: {
        zoom: 2
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
    },
    renderedDuration () {
      return renderDuration(this.durationMinutes)
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
  beforeDestroy () {
    this.updateTrail({ trailId: this.trailId, newProps: { mapData: this.mapData } })
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
      this.description = this.$sanitize(trail.description)
      this.durationMinutes = trail.durationMinutes
      this.physicalEffort = trail.physicalEffort
      this.mentalEffort = trail.mentalEffort
      this.graph.trailEntries = [...trail.graph.trailEntries]
      this.graph.endNodes = [...trail.graph.endNodes]
      Object.entries(trail.graph.nodes).forEach(node => {
        vm.$set(vm.graph.nodes, node[0], { ...node[1] })
      })
      this.pdfData = cloneDeep(trail.pdfData)
      this.mapData = cloneDeep(trail.mapData)
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
          description: this.$sanitize(this.description),
          durationMinutes: this.durationMinutes,
          physicalEffort: this.physicalEffort,
          mentalEffort: this.mentalEffort,
          position,
          graph: this.graph,
          mapData: this.mapData,
          pdfData: this.pdfData
        }
      })
    },
    removeStation ({ removedStationId, updatedGraph, bypassConfirm }) {
      if (Object.keys(updatedGraph.nodes).length > 1) {
        const vm = this
        if (!bypassConfirm) {
          this.dialog.okBtn.method = () => {
            vm.dialog.open = false
            vm.updateGraph(updatedGraph)
            return vm.removeStationInTrail({ trailId: vm.trailId, removedStationId, updatedGraph })
          }
          this.dialog.cancelBtn.method = () => { vm.dialog.open = false }
          this.dialog.title = this.$t('editor.trail.askRemoveStation')
          this.dialog.message = this.$t('editor.trail.allStationDataWillBeLost')
          this.dialog.okBtn.label = this.$t('editor.trail.confirmRemoveStation')
          this.dialog.cancelBtn.label = this.$t('editor.trail.doNotRemoveStation')
          this.dialog.open = true
        } else {
          this.updateGraph(updatedGraph)
          return this.removeStationInTrail({ trailId: this.trailId, removedStationId, updatedGraph })
        }
      }
    },
    promptSaveBefore (methodName, payload) {
      const vm = this

      if (this.difference) {
        this.dialog.okBtn.method = () => {
          this.dialog.open = false
          const newPayload = { ...payload, bypassConfirm: true }
          return vm[methodName](newPayload)
        }
        this.dialog.cancelBtn.method = () => { vm.dialog.open = false }
        switch (methodName) {
          case 'updateTrailAndCreateStation': {
            this.dialog.title = this.$t('editor.changes.unsavedChanges')
            this.dialog.message = ''
            this.dialog.okBtn.label = this.$t('editor.trail.saveChangesThenCreateStation')
            this.dialog.cancelBtn.label = this.$t('editor.trail.doNotCreateStation')
            break
          }
          case 'removeStation': {
            this.dialog.title = this.$t('editor.trail.askSaveThenRemoveStation')
            this.dialog.message = this.$t('editor.trail.allStationDataWillBeLost')
            this.dialog.okBtn.label = this.$t('editor.trail.saveChangesThenRemoveStation')
            this.dialog.cancelBtn.label = this.$t('editor.trail.doNotRemoveStation')
            break
          }
          default: break
        }
        this.dialog.open = true
      } else {
        return vm[methodName](payload)
      }
    }
  }
}
</script>
