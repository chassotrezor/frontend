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
        v-for="clue in clues"
        :key="clue.clueId"
        :ref="clue.clueId"
        class="QrCodeModule_test"
        style="page-break-after: always"
      >
        <div
          v-html="clue.qrCode"
        />
        <div class="text-h6">
          {{ clue.name }}
        </div>
        <div>{{ clue.url }}</div>
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
    clues () {
      const vm = this
      return Object.values(this.trailScheme).map(clue => {
        const clueId = clue.id
        const url = generateString(vm.trailId, clueId)
        const name = clue.name
        const qrCode = new QRCode({
          content: url
        }).svg()
        return { clueId, name, url, qrCode }
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
