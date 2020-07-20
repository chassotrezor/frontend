import { isOutOfBoundsBounds, getRadius } from './mapHelpers'

const oldBounds = {
  _northEast: { lat: 10, lng: 10 },
  _southWest: { lat: -10, lng: -10 }
}

describe('mapHelpers', () => {
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
