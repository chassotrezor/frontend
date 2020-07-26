<template>
  <div>
    <div
      class="column items-center bg-black shadow-6"
      :style="phoneStyle"
    >
      <div
        class="row justify-center items-center"
        :style="topStyle"
      >
        <div
          :style="speakerStyle"
        />
      </div>
      <div
        :style="screenStyle"
      >
        <div
          class="bg-primary"
          :style="headerStyle"
        >
          <q-toolbar class="text-grey-3">
            <q-icon
              :size="`${(headerHeight / 2).toString()}px`"
              name="menu"
            />
            <q-toolbar-title>
              Chassotrezor
            </q-toolbar-title>
          </q-toolbar>
        </div>
        <q-scroll-area
          class="bg-light"
          :style="pageStyle"
        >
          <station-renderer
            class="StationRenderer_test"
            :trail-name="trailName"
            :station-name="stationName"
            :rows="rows"
          />
        </q-scroll-area>
      </div>
      <div
        class="row justify-center items-center"
        :style="bottomStyle"
      >
        <div :style="btnStyle" />
      </div>
    </div>
  </div>
</template>

<script>
import StationRenderer from 'components/Trail/Station/StationRenderer'

export default {
  name: 'StationPreview',
  components: { StationRenderer },
  props: {
    trailName: {
      type: String,
      required: true
    },
    stationName: {
      type: String,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      width: 300,
      height: 500,
      topMargin: 40,
      bottomMargin: 80,
      horizontalMargin: 20,
      speakerWidth: 30,
      speakerHeight: 10,
      btnDiameter: 50
    }
  },
  computed: {
    headerHeight () {
      // TODO: react to widht and height changes, according to app rules
      return 50
    },
    phoneStyle () {
      let style = ''
      style += `width: ${this.width + 2 * this.horizontalMargin}px; `
      style += `height: ${this.height + this.topMargin + this.bottomMargin}px; `
      style += `border-radius: ${this.horizontalMargin}px`
      return style
    },
    topStyle () {
      let style = ''
      style += `width: ${this.width}px; `
      style += `height: ${this.topMargin}px; `
      return style
    },
    screenStyle () {
      let style = ''
      style += `width: ${this.width}px; `
      style += `height: ${this.height}px; `
      return style
    },
    headerStyle () {
      let style = ''
      style += `width: ${this.width}px; `
      style += `height: ${this.headerHeight}px; `
      return style
    },
    pageStyle () {
      let style = ''
      style += `width: ${this.width}px; `
      style += `height: ${this.height - this.headerHeight}px; `
      return style
    },
    bottomStyle () {
      let style = ''
      style += `width: ${this.width}px; `
      style += `height: ${this.bottomMargin}px; `
      return style
    },
    speakerStyle () {
      let style = ''
      style += 'background-color: #666666; '
      style += `width: ${this.speakerWidth}px; `
      style += `height: ${this.speakerHeight}px; `
      style += `border-radius: ${this.speakerHeight / 2}px; `
      return style
    },
    btnStyle () {
      let style = ''
      style += `width: ${this.btnDiameter}px; `
      style += `height: ${this.btnDiameter}px; `
      style += `border-radius: ${this.btnDiameter / 2}px; `
      style += 'border: 3px solid #666666; '
      return style
    }
  }
}
</script>

<style lang="sass" scoped>
.phone-btn
  width: 40px
  height: 40px
  border-radius: 50%
  border: 2px solid $grey-8
</style>
