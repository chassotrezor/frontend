<template>
  <div>
    <q-btn
      class="ShowQrCodesBtn_test"
      :label="$t('editor.trail.qrCodes')"
      :icon="showCodes ? 'arrow_drop_up' : 'arrow_drop_down'"
      @click="showCodes = !showCodes"
    />
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="showCodes">
        <q-btn
          class="QBtn_test"
          icon="cloud_download"
          :label="$t('editor.trail.downloadQrCodes')"
          @click="makePdf"
        />
        <div ref="qrCodes">
          <div
            v-for="station in stations"
            :key="station.stationId"
            :ref="station.stationId"
            class="QrCodeModule_test"
            style="page-break-after: always"
          >
            <div
              v-html="station.qrCode"
            />
            <div class="text-h6">
              {{ station.name }}
            </div>
            <div>{{ station.url }}</div>
            <br>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import QRCode from 'qrcode-svg'
import html2pdf from 'html2pdf.js'
import { generateString } from 'components/codeHelpers.js'
import types from 'src/types'

export default {
  name: 'QrCodesGenerator',
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
    }
  },
  data () {
    return {
      showCodes: false
    }
  },
  computed: {
    stations () {
      // If trail has no branch and order matters

      const stations = []
      let nodeId = this.graph.endNodes[0]
      while (nodeId) {
        const node = this.graph.nodes[nodeId]
        if (node.type === types.nodes.STATION) {
          const stationId = nodeId
          const url = generateString(this.trailId, stationId)
          const name = node.name
          const qrCode = new QRCode({
            content: url
          }).svg()
          stations.unshift({ stationId, name, url, qrCode })
        }
        nodeId = node.dependencies[0] || null
      }
      return stations

      // If order does not matter :

      // const vm = this
      // return Object.entries(this.graph.nodes).reduce((stations, node) => {
      //   if (node[1].type === types.nodes.STATION) {
      //     const stationId = node[0]
      //     const url = generateString(vm.trailId, stationId)
      //     const name = node[1].name
      //     const qrCode = new QRCode({
      //       content: url
      //     }).svg()
      //     stations.push({ stationId, name, url, qrCode })
      //   }
      //   return stations
      // }, [])
    }
  },
  methods: {
    makePdf () {
      const html = this.$refs.qrCodes
      html2pdf(html)
    }
  }
}
</script>
