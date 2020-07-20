<template>
  <qrcode-stream @decode="onDecode" />
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { getTrailId, getStationId, checkCodeValidity } from 'src/helpers/codeHelpers'

export default {
  name: 'Scanner',
  components: {
    QrcodeStream
  },
  methods: {
    onDecode (code) {
      const codeIsValid = checkCodeValidity(code)
      if (codeIsValid) {
        const trailId = getTrailId(code)
        const stationId = getStationId(code)
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
