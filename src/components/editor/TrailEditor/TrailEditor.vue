<template>
  <div>
    <q-input v-model="name" />
    <q-btn
      class="UpdateBtn_test"
      icon="send"
      color="primary"
      @click="updateTrail({ trailId, newProps: { name } })"
    />
    <br>
    <div>Stations :</div>
    <station-card
      v-for="station in trail.trailScheme"
      :key="station.id"
      class="StationCard_test"
      :station="station"
      :trail-id="trailId"
      @edit="editStation"
    />
    <q-btn
      class="CreateStation_test"
      icon="add"
      label="nouvel indice"
      @click="createAndEditStation"
    />
    <qr-codes-generator
      :trail-id="trailId"
      :trail-name="trail.name"
      :trail-scheme="trail.trailScheme"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import StationCard from './StationCard'
import QrCodesGenerator from './QrCodesGenerator'

export default {
  name: 'TrailEditor',
  components: {
    StationCard,
    QrCodesGenerator
  },
  props: {
    trailId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters({
      getTrail: 'editor/getTrail'
    }),
    trail () {
      return this.getTrail({ trailId: this.trailId })
    },
    stationIds () {
      return Object.values(this.trail.trailScheme).map(station => station.id)
    }
  },
  mounted () {
    this.name = this.trail.name
  },
  methods: {
    ...mapActions({
      updateTrail: 'editor/updateTrail',
      createStation: 'editor/createStation'
    }),
    async createAndEditStation () {
      const trailId = this.trailId
      const stationId = await this.createStation({ trailId })
      this.editStation(stationId)
    },
    editStation (stationId) {
      this.$emit('editStation', stationId)
    }
  }
}
</script>
