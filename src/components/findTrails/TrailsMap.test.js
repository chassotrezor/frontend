import { mountQuasar } from '@test'
import TrailsMap from './TrailsMap'

const trails = [
  {
    name: 'trailName1',
    position: {
      geopoint: {
        latitude: 31,
        longitude: 41
      }
    },
    published: true
  },
  {
    name: 'trailName2',
    position: {
      geopoint: {
        latitude: 32,
        longitude: 42
      }
    },
    published: true
  },
  {
    name: 'trailName3',
    position: {
      geopoint: {
        latitude: 33,
        longitude: 43
      }
    },
    published: false
  }
]

const expectedLength = trails.reduce((length, trail) => {
  if (trail.published) length += 1
  return length
}, 0)

const $geo = {
  point: (lng, lat) => { return { longitude: lng, latitude: lat } },
  query: () => {
    return {
      within: () => {
        return {
          subscribe: fn => fn(trails)
        }
      }
    }
  }
}

const oldBounds = {
  _northEast: { lat: 0, lng: 0 },
  _southWest: { lat: 0, lng: 0 }
}

const newBounds = {
  _northEast: { lat: 35, lng: 45 },
  _southWest: { lat: 25, lng: 35 }
}

const mapObject = {
  getBounds: () => newBounds
}

describe('TrailsMap', () => {
  const wrapper = mountQuasar(TrailsMap, {
    mocks: {
      $geo
    }
  })
  const basicMap = wrapper.find('.BasicMap_test')

  it('displays a "BasicMap"', () => {
    expect(basicMap.exists()).toBe(true)
  })

  describe('when "BasicMap" emits "ready"', () => {
    beforeAll(async () => {
      basicMap.vm.$emit('ready', mapObject)
      await wrapper.vm.$nextTick()
    })

    it('updates nearby published trails on map', () => {
      const trailMarkers = wrapper.findAll('.TrailMarker_test')
      expect(trailMarkers.length).toBe(expectedLength)
    })

    afterAll(async () => {
      wrapper.vm.trails = []
      wrapper.vm.oldBounds = oldBounds
      await wrapper.vm.$nextTick()
    })
  })

  describe('when "BasicMap" emits "update:bounds" and bounds move out of tolerance', () => {
    beforeAll(async () => {
      basicMap.vm.$emit('update:bounds', newBounds)
      await wrapper.vm.$nextTick()
    })

    it('updates nearby published trails on map', () => {
      const trailMarkers = wrapper.findAll('.TrailMarker_test')
      expect(trailMarkers.length).toBe(expectedLength)
    })

    afterAll(async () => {
      wrapper.vm.trails = []
      wrapper.vm.oldBounds = oldBounds
      await wrapper.vm.$nextTick()
    })
  })

  describe('when "BasicMap" emits "update:bounds" and bounds stay in tolerance', () => {
    beforeAll(async () => {
      wrapper.vm.oldBounds = newBounds
      basicMap.vm.$emit('update:bounds', newBounds)
      await wrapper.vm.$nextTick()
    })

    it('does not update trails', () => {
      const trailMarkers = wrapper.findAll('.TrailMarker_test')
      expect(trailMarkers.length).toBe(0)
    })

    afterAll(async () => {
      wrapper.vm.trails = []
      wrapper.vm.oldBounds = oldBounds
      await wrapper.vm.$nextTick()
    })
  })
})
