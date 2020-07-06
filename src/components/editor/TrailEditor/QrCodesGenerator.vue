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
    trailScheme: {
      type: Object,
      required: true
    }
  },
  computed: {
    stations () {
      const vm = this
      return Object.values(this.trailScheme).map(station => {
        const stationId = station.id
        const url = generateString(vm.trailId, stationId)
        const name = station.name
        const qrCode = new QRCode({
          content: url
        }).svg()
        return { stationId, name, url, qrCode }
      })
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
