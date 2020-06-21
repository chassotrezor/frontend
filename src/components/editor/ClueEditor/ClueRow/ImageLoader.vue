<template>
  <div>
    <q-img
      class="fullWidth"
      :src="src"
      alt="sélectionnez une image"
    />
    <q-file
      v-model="file"
      :label="label"
      filled
      accept="image/*"
      @input="loadImage"
    >
      <template
        v-if="file"
        v-slot:append
      >
        <div
          class="row justify-end items-center"
          style="width: 100px"
        >
          <q-btn
            v-if="progress === 0"
            round
            icon="send"
            @click="uploadFile"
          />
          <q-circular-progress
            v-else
            :value="progress"
            color="primary"
            size="lg"
            show-value
          >
            {{ Math.ceil(progress) }}%
          </q-circular-progress>
        </div>
      </template>
    </q-file>
  </div>
</template>

<script>
// TODO: consider using this: https://quasar.dev/vue-components/uploader#Supporting-other-services
import { mapActions } from 'vuex'

export default {
  name: 'ImageLoader',
  props: {
    subPath: {
      type: String,
      required: true
    },
    initialSrc: {
      type: String,
      default: () => ''
    },
    width: {
      type: String,
      default: () => '100px'
    },
    height: {
      type: String,
      default: () => '100px'
    },
    label: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      file: undefined,
      src: undefined,
      progress: 0
    }
  },
  mounted () {
    this.src = this.initialSrc
  },
  methods: {
    ...mapActions({
      uploadImage: 'editor/uploadImage'
    }),
    imageHandler (event) {
      this.src = event.target.result
    },
    loadImage (file) {
      this.progress = 0
      const fr = new FileReader()
      fr.onload = this.imageHandler
      fr.readAsDataURL(file)
    },
    showProgress (snapshot) {
      this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    },
    async uploadFile () {
      const url = await this.uploadImage({
        file: this.file,
        subPath: this.subPath,
        onProgress: this.showProgress
      })
      this.$emit('url', url)
    }
  }
}
</script>
