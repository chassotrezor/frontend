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
    onDecode (decodedString) {
      console.log(decodedString)
    }
  }
}
</script>
