export default {
  data () {
    return {
      pageHeight: window.innerHeight
    }
  },
  computed: {
    layoutHeaderHeight () {
      const header = document.getElementsByClassName('q-header').item(0)
      const height = header === null ? 0 : header.scrollHeight
      return height
    },
    layoutFooterHeight () {
      const footer = document.getElementsByClassName('q-footer').item(0)
      const height = footer === null ? 0 : footer.scrollHeight
      return height
    },
    windowInnerHeight () {
      return window.innerHeight
    }
  },
  methods: {
    setPageHeight () {
      this.pageHeight = this.windowInnerHeight - this.layoutHeaderHeight - this.layoutFooterHeight
    },
    startListeningToResize () {
      window.addEventListener('resize', this.setPageHeight)
    },
    stopListeningToResize () {
      window.removeEventListener('resize', this.setPageHeight)
    }
  },
  mounted () {
    this.setPageHeight()
    this.startListeningToResize()
  },
  beforeDestroy () {
    this.stopListeningToResize()
  }
}
