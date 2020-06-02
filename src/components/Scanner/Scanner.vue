<template>
  <qrcode-stream @decode="onDecode" />
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
  name: 'Scanner',
  components: {
    QrcodeStream
  },
  methods: {
    checkQRCode (code) {
      if (code) return true
      else return false
    },
    parseChaseID (code) {
      const splittedCode = code.split(':')
      return splittedCode[0]
    },
    parseClueID (code) {
      const splittedCode = code.split(':')
      return splittedCode[1]
    },
    onDecode (code) {
      const codeIsValid = this.checkQRCode(code)
      if (codeIsValid) {
        const chaseID = this.parseChaseID(code)
        const clueID = this.parseClueID(code)
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
