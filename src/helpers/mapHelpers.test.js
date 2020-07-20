import {
  fromArray,
  fromGeopoint,
  fromLatLng,
  fromNavigatorPosition,
  isOutOfBoundsBounds,
  getRadius
} from './mapHelpers'
import { firestore } from 'firebase'
import { latLng } from 'leaflet'

describe('mapHelpers', () => {
  const arrayCoords = [17, 24]
  const geopoint = new firestore.GeoPoint(...arrayCoords)
  const latlng = latLng(...arrayCoords)
  const navigatorPosition = {
    coords: {
      latitude: arrayCoords[0],
      longitude: arrayCoords[1],
      altitude: 0,
      accuracy: 1,
      altitudeAccuracy: 1,
      heading: NaN,
      speed: null
    },
    timestamp: 0
  }
  describe('positionTranslator', () => {
    describe('from Geopoint', () => {
      it('can convert to LatLng equivalent', () => {
        const newLatLng = fromGeopoint(geopoint).toLatLng()
        expect(newLatLng).toEqual(latlng)
      })
    })

    describe('from LatLng', () => {
      it('can convert to Geopoint equivalent', () => {
        const newGeopoint = fromLatLng(latlng).toGeopoint()
        expect(newGeopoint).toEqual(geopoint)
      })
    })

    describe('from Navigator Position', () => {
      let position
      beforeAll(() => {
        position = fromNavigatorPosition(navigatorPosition)
      })

      it('can convert to Geopoint equivalent', () => {
        expect(position.toGeopoint()).toEqual(geopoint)
      })

      it('can convert to LatLng equivalent', () => {
        expect(position.toLatLng()).toEqual(latlng)
      })
    })

    describe('from Array', () => {
      let position
      beforeAll(() => {
        position = fromArray(arrayCoords)
      })

      it('can convert to Geopoint equivalent', () => {
        expect(position.toGeopoint()).toEqual(geopoint)
      })

      it('can convert to LatLng equivalent', () => {
        expect(position.toLatLng()).toEqual(latlng)
      })
    })
  })

  describe('geofirex helpers', () => {
    const oldBounds = {
      _northEast: { lat: 10, lng: 10 },
      _southWest: { lat: -10, lng: -10 }
    }
    describe('isOutOfBoundsBounds', () => {
      it('returns true if one of the new bounds is off old bounds tolerance', () => {
        const deviation = 5
        Object.entries(oldBounds).forEach(bound => {
          Object.entries(bound[1]).forEach(axis => {
            const newBounds = {
              ...oldBounds,
              [bound[0]]: {
                ...oldBounds[bound[0]],
                [axis[0]]: axis[1] + deviation
              }
            }
            expect(isOutOfBoundsBounds({ newBounds, oldBounds })).toBe(true)
          })
        })
      })

      it('returns false if all the new bounds are within the old bounds tolerance', () => {
        const newBounds = {
          _northEast: { lat: 11, lng: 12 },
          _southWest: { lat: -9, lng: -8 }
        }
        expect(isOutOfBoundsBounds({ newBounds, oldBounds })).toBe(false)
      })
    })

    describe('getRadius', () => {
      it('returns half the distance between the two bounds', () => {
        expect(getRadius({ bounds: oldBounds })).toBeCloseTo(1569, 0)
      })
    })
  })
})
