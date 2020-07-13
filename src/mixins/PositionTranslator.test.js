import PositionTranslator from './PositionTranslator'
import { mountMixin } from '@test'
import { firestore } from 'firebase'
import { latLng } from 'leaflet'

const testCoords = [17, 24]
const geopoint = new firestore.GeoPoint(...testCoords)
const latlng = latLng(...testCoords)
const navigatorPosition = {
  coords: {
    latitude: testCoords[0],
    longitude: testCoords[1],
    altitude: 0,
    accuracy: 1,
    altitudeAccuracy: 1,
    heading: NaN,
    speed: null
  },
  timestamp: 0
}

describe('positionTranslator', () => {
  let wrapper
  beforeAll(async () => {
    wrapper = mountMixin(PositionTranslator)
    await wrapper.vm.$nextTick()
  })

  describe('from Geopoint', () => {
    it('can convert to LatLng equivalent', () => {
      const newLatLng = wrapper.vm.fromGeopoint(geopoint).toLatLng()
      expect(newLatLng).toEqual(latlng)
    })
  })

  describe('from LatLng', () => {
    it('can convert to Geopoint equivalent', () => {
      const newGeopoint = wrapper.vm.fromLatLng(latlng).toGeopoint()
      expect(newGeopoint).toEqual(geopoint)
    })
  })

  describe('from Navigator Position', () => {
    let position
    beforeAll(() => {
      position = wrapper.vm.fromNavigatorPosition(navigatorPosition)
    })

    it('can convert to Geopoint equivalent', () => {
      expect(position.toGeopoint()).toEqual(geopoint)
    })

    it('can convert to LatLng equivalent', () => {
      expect(position.toLatLng()).toEqual(latlng)
    })
  })
})
