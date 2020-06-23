// MyUploader.js
import { QUploaderBase } from 'quasar'
import firebase from 'firebase/app'

export default {
  name: 'Uploader',

  mixins: [QUploaderBase],

  props: {
    path: {
      type: String,
      required: true
    },
    fileId: {
      type: String,
      default: () => undefined
    }
  },

  data () {
    return {
      uploadTask: undefined
    }
  },

  computed: {
    // [REQUIRED]
    // we're working on uploading files
    isUploading () {
      return !!this.uploadTask
    },

    // [optional]
    // shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    isBusy () {
      // return !!this.uploadTask
      return false
    }
  },

  methods: {
    // [REQUIRED]
    // abort and clean up any process
    // that is in progress
    abort () {
      this.uploadTask.cancel()
    },

    // [REQUIRED]
    /*
      Warning ! This method cannot upload multiple files.
      "multiple" prop must never be true

      TODO: handle errors
    */
    async upload () {
      const vm = this
      if (this.canUpload) {
        const userId = firebase.auth().currentUser.uid
        const path = `${userId}/${this.path}`
        const storageRef = firebase.storage().ref().child(path)
        const file = this.queuedFiles[0]
        const list = await storageRef.listAll()
        let fileId = this.fileId
        if (!fileId) {
          do {
            fileId = Math.random().toString(36).substring(2)
          } while (list.items.some(item => item.location.path === `${path}/${fileId}`))
        }
        this.uploadTask = storageRef.child(fileId).put(file)
        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
          next: snapshot => {
            vm.__updateFile(file, 'uploading', snapshot.bytesTransferred)
            vm.uploadedSize = snapshot.bytesTransferred
          }
        })
        this.uploadTask.then(async snapshot => {
          const url = await snapshot.ref.getDownloadURL()
          this.$emit('uploaded', { url, fileId })
          vm.__updateFile(file, 'uploaded')
          vm.reset()
          vm.uploadTask = undefined
        })
        this.$emit('uploading', this.uploadTask)
      }
    }
  }
}
