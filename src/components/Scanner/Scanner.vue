<template>
  <qrcode-stream @decode="onDecode" />
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { gettrailId, getclueId, checkCodeValidity } from 'components/codeHelpers'

export default {
  name: 'Scanner',
  components: {
    QrcodeStream
  },
  methods: {
    onDecode (code) {
      const codeIsValid = checkCodeValidity(code)
      if (codeIsValid) {
        const trailId = gettrailId(code)
        const clueId = getclueId(code)
        this.$router.push({
          name: 'clue',
          params: {
            trailId,
            clueId
          }
        })
      }
    }
  }
}
</script>
