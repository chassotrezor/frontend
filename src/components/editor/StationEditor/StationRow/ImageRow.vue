<template>
  <div class="column q-gutter-y-md">
    <div class="row items-end no-wrap q-gutter-x-md">
      <q-slider
        class="WidthHandler_test"
        style="width: 190px"
        :value="row.data.width"
        :min="10"
        :max="100"
        label
        :label-value="`${$t('editor.station.image.width')}: ${width}%`"
        @input="updateWidth"
      />
      <q-input
        class="col-grow UrlInput_test"
        :value="row.data.url"
        :label="$t('editor.station.image.url')"
        @input="updateUrl"
      />
    </div>
    <div class="row no-wrap q-gutter-x-md">
      <q-card
        content-class="column justify-center items-center"
      >
        <q-card-section>
          <q-img
            class="QImg_test"
            width="160px"
            height="160px"
            contain
            :src="row.data.url"
          />
        </q-card-section>
      </q-card>
      <transition
        enter-active-class="animate__animated animate__bounceIn"
        leave-active-class="animate__animated animate__bounceOut"
        mode="out-in"
      >
        <firebase-uploader
          v-if="row.data.fileId === oldRowData.fileId"
          key="uploader"
          class="col-grow FirebaseUploader_test"
          :path="path"
          :file-id="row.rowId"
          @uploaded="updateFile"
        >
          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
              <q-spinner
                v-if="scope.isUploading"
                class="q-uploader__spinner"
              />
              <div class="col">
                <div class="q-uploader__title">
                  {{ $t('editor.station.image.sendImage') }}
                </div>
                <div class="q-uploader__subtitle">
                  {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
                </div>
              </div>
              <q-btn
                v-if="scope.canAddFiles"
                type="a"
                icon="add_box"
                round
                dense
                flat
              >
                <q-uploader-add-trigger />
              </q-btn>
              <q-btn
                v-if="scope.canUpload"
                icon="cloud_upload"
                round
                dense
                flat
                @click="promptSaveThen(scope.upload)"
              />
            </div>
          </template>
        </firebase-uploader>
        <q-card
          v-else
          key="warningDelete"
          class="col-grow bg-warning text-black WarningDeleteImage_test"
          style="width: 300px"
        >
          <q-card-section class="text-h6">
            {{ $t('navigation.warning') }}
          </q-card-section>
          <q-card-section>
            {{ $t('editor.station.image.warningDeleteImage') }}
          </q-card-section>
        </q-card>
      </transition>
    </div>
  </div>
</template>

<script>
import FirebaseUploader from 'src/store/FirebaseUploader'
import defaultData from './rowsDefaultData'

export default {
  name: 'ImageRow',
  components: {
    FirebaseUploader
  },
  props: {
    row: {
      type: Object,
      required: true
    },
    oldRowData: {
      type: Object,
      default: () => defaultData.IMAGE
    }
  },
  data () {
    return {
      width: 10,
      url: '',
      fileId: ''
    }
  },
  computed: {
    path () {
      const trailId = this.$route.params.trailId
      const stationId = this.$route.params.stationId
      return `${trailId}/${stationId}`
    }
  },
  mounted () {
    this.width = this.row.data.width
    this.fileId = this.row.data.fileId
    this.url = this.row.data.url
  },
  methods: {
    updateFile (fileData) {
      this.fileId = fileData.fileId
      this.url = fileData.url
      this.$emit('input', {
        data: {
          fileId: this.fileId,
          url: this.url
        }
      })
      this.$emit('triggerSave')
    },
    updateWidth (width) {
      this.width = width
      this.$emit('input', {
        data: {
          width: this.width
        }
      })
    },
    updateUrl (url) {
      this.url = url
      this.fileId = null
      this.$emit('input', {
        data: {
          fileId: this.fileId,
          url: this.url
        }
      })
    },
    promptSaveThen (callback) {
      this.$q.dialog({
        title: this.$t('editor.station.image.uploadThenSave'),
        cancel: {
          label: this.$t('navigation.cancel')
        },
        ok: {
          label: this.$t('navigation.ok')
        }
      }).onOk(callback)
    }
  }
}
</script>
