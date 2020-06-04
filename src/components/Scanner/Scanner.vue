<template>
  <qrcode-stream @decode="onDecode" />
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { getChaseID, getClueID, checkCodeValidity } from 'components/codeHelpers'

export default {
  name: 'Scanner',
  components: {
    QrcodeStream
  },
  methods: {
    onDecode (code) {
      const codeIsValid = checkCodeValidity(code)
      if (codeIsValid) {
        const chaseID = getChaseID(code)
        const clueID = getClueID(code)
        this.$router.push({
          name: 'clue',
          params: {
            chaseID,
            clueID
          }
        })
      }
    }
  }
}
</script>
