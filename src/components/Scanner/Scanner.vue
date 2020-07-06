<template>
  <qrcode-stream @decode="onDecode" />
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { gettrailId, getstationId, checkCodeValidity } from 'components/codeHelpers'

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
        const stationId = getstationId(code)
        this.$router.push({
          name: 'station',
          params: {
            trailId,
            stationId
          }
        })
      }
    }
  }
}
</script>
