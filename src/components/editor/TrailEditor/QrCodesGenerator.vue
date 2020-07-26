<template>
  <div
    class="row justify-between q-pb-xl"
    style="width: 800px"
  >
    <div class="column q-gutter-y-sm">
      <q-btn-group
        class="row"
        style="z-index: 1"
      >
        <q-btn
          class="col-grow PdfNavigationPrevious_test"
          icon="navigate_before"
          color="lighter"
          text-color="dark"
          :disable="page === 1"
          @click="page -= 1"
        />
        <q-btn
          class="col-grow PdfNavigationNext_test"
          icon="navigate_next"
          color="lighter"
          text-color="dark"
          :disable="page === numPages"
          @click="page += 1"
        />
      </q-btn-group>
      <pdf
        class="PdfViewer_test bordered"
        :src="pdf"
        :page="page"
        style="width: 350px; height: 495px"
      />
    </div>
    <div class="column justify-between">
      <q-btn
        class="DownloadCodes_test"
        color="lighter"
        text-color="dark"
        icon="cloud_download"
        :label="$t('editor.trail.downloadQrCodes')"
        @click="makePdf"
      />
      <q-slider
        v-model="width"
        class="q-mt-md WidthInput_test"
        :min="10"
        :max="200"
        label
        label-always
        :label-value="`${$t('editor.trail.qrCodesWidth')}: ${width / 10} cm`"
        @change="updateWidth"
      />
      <div class="row justify-between q-gutter-x-md">
        <div>
          <div class="row justify-around items-center">
            <div class="text-center text-h6">
              {{ $t('editor.trail.qrCodesLight') }}
            </div>
            <div
              class="color-dot"
              :style="`background-color: ${colors.light}`"
            />
          </div>
          <q-color
            v-model="colors.light"
            class="LightColorInput_test"
            no-header
            default-view="palette"
            @change="updateLightColorIfLightEnough"
          />
        </div>
        <div>
          <div class="row justify-between items-center">
            <div
              class="color-dot"
              :style="`background-color: ${colors.dark}`"
            />
            <div class="text-center text-h6">
              {{ $t('editor.trail.qrCodesDark') }}
            </div>
          </div>
          <q-color
            v-model="colors.dark"
            class="DarkColorInput_test"
            no-header
            default-view="palette"
            @change="updateDarkColorIfDarkEnough"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsPDF from 'jspdf'
import pdf from 'vue-pdf'
import { generateQrCodeAsDataUrl } from 'src/helpers/codeHelpers.js'
import { hexToRgb } from 'src/helpers/dataHelpers.js'
import { fromGeopoint } from 'src/helpers/mapHelpers'
import types from 'src/types'

export default {
  name: 'QrCodesGenerator',
  components: { pdf },
  props: {
    trailId: {
      type: String,
      required: true
    },
    trailName: {
      type: String,
      required: true
    },
    graph: {
      type: Object,
      required: true
    },
    pdfData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showCodes: false,
      page: 1,
      width: 100,
      colors: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }
  },
  computed: {
    numPages () {
      return Object.values(this.graph.nodes).reduce((numPages, node) => {
        if (node.type === types.nodes.STATION) numPages += 1
        return numPages
      }, 0)
    },
    doc () {
      const doc = new JsPDF()

      let nodeId = this.graph.endNodes[0]
      while (nodeId) {
        const node = this.graph.nodes[nodeId]
        if (node.type === types.nodes.STATION) {
          doc.setFontSize(20)
          doc.setFontStyle('bold')
          doc.text(this.trailName, 20, 20)

          const stationName = node.name
          doc.setFontStyle('normal')
          doc.text(stationName, 190, 20, { align: 'right' })

          const stationId = nodeId
          const url = generateQrCodeAsDataUrl(this.trailId, stationId, this.pdfData.colors)
          const qrCode = doc.extractImageFromDataUrl(url)
          const x = (210 - this.pdfData.width) / 2
          const y = (297 - this.pdfData.width) / 2
          doc.addImage(qrCode.data, qrCode.mimeType, x, y, this.pdfData.width, this.pdfData.width)

          const positionArray = fromGeopoint(node.position).toArray()
          const longitude = `${this.$t('editor.trail.qrCodesLongitude')}: ${positionArray[0].toFixed(6)}`
          const latitude = `${this.$t('editor.trail.qrCodesLatitude')}: ${positionArray[1].toFixed(6)}`
          doc.setFontSize(15)
          doc.text(longitude, 20, 277)
          doc.text(latitude, 190, 277, { align: 'right' })
        }
        nodeId = node.dependencies[0] || null
        if (nodeId) {
          doc.insertPage(1)
          doc.setPage(1)
        }
      }
      return doc
    },
    pdf () {
      return this.doc.output('dataurlstring')
    }
  },
  watch: {
    pdfData (pdfData) {
      this.duplicatePdfData(pdfData)
    }
  },
  mounted () {
    this.duplicatePdfData(this.pdfData)
  },
  methods: {
    duplicatePdfData (pdfData) {
      this.width = pdfData.width
      this.colors.light = pdfData.colors.light
      this.colors.dark = pdfData.colors.dark
    },
    isContrastCorrect (light, dark) {
      const lightLuminosity = hexToRgb(light).reduce((lum, color) => lum + color, 0)
      const darkLuminosity = hexToRgb(dark).reduce((lum, color) => lum + color, 0)
      return lightLuminosity - darkLuminosity > 200
    },
    updateLightColorIfLightEnough (lightColor) {
      if (this.isContrastCorrect(lightColor, this.colors.dark)) {
        this.$emit('update:light', lightColor)
      } else {
        this.colors.light = this.pdfData.colors.light
        this.$q.notify({
          position: 'bottom-right',
          message: this.$t('editor.trail.qrCodesNotLightEnough'),
          color: 'warning',
          textColor: 'black'
        })
      }
    },
    updateDarkColorIfDarkEnough (darkColor) {
      if (this.isContrastCorrect(this.colors.light, darkColor)) {
        this.$emit('update:dark', darkColor)
      } else {
        this.colors.dark = this.pdfData.colors.dark
        this.$q.notify({
          position: 'bottom-right',
          message: this.$t('editor.trail.qrCodesNotDarkEnough'),
          color: 'warning',
          textColor: 'black'
        })
      }
    },
    updateWidth (width) {
      this.$emit('update:width', width)
    },
    makePdf () {
      this.doc.save('qrCodes.pdf')
    }
  }
}
</script>

<style lang="sass" scoped>
.color-dot
  border: 2px solid black
  border-radius: 50%
  width: 2em
  height: 2em
  margin: 0.5em
</style>
