<template>
  <div>
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
    trailNodes: {
      type: Object,
      required: true
    }
  },
  computed: {
    stations () {
      const vm = this
      return Object.entries(this.trailNodes).reduce((stations, node) => {
        if (node[1].type === types.nodes.STATION) {
          const stationId = node[0]
          const url = generateString(vm.trailId, stationId)
          const name = node[1].name
          const qrCode = new QRCode({
            content: url
          }).svg()
          stations.push({ stationId, name, url, qrCode })
        }
        return stations
      }, [])
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
