import { mountQuasar } from '@test'
import BasicMap from './BasicMap'
import { latLng } from 'leaflet'

// global.navigator.geolocation.getCurrentPosition = jest.fn()
// const watchPosition = jest.spyOn(navigator.geolocation, 'watchPosition')
// const clearWatch = jest.spyOn(navigator.geolocation, 'clearWatch')

const position = {
  coords: {
    latitude: 30,
    longitude: 40
  }
}
const expectedCenter = latLng(position.coords.latitude, position.coords.longitude)
const expectedZoom = 9
const watchId = 1234567890

const geolocationMocks = {
  getCurrentPosition: jest.fn((positionFct, errorFct) => { positionFct(position) }),
  watchPosition: jest.fn((positionFct, errorFct) => {
    positionFct(position)
    return watchId
  }),
  clearWatch: jest.fn()
}
global.navigator.geolocation = geolocationMocks

const setView = jest.fn()
const getZoom = () => 0

describe('BasicMap', () => {
  let wrapper
  let toggle

  beforeAll(async () => {
    wrapper = mountQuasar(BasicMap)
    await wrapper.vm.$nextTick()
    toggle = wrapper.find('.ToggleWatchPosition_test')
    wrapper.vm.$refs.map.mapObject = {
      setView,
      getZoom
    }
  })

  it('displays a "toggle watch position" btn', () => {
    expect(toggle.exists()).toBe(true)
  })

  describe('after "toggle watch position btn" turns on', () => {
    beforeAll(async () => {
      wrapper.vm.showPosition = false
      toggle.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('moves to currentPosition and zooms to level 9', () => {
      expect(setView).toHaveBeenCalledWith(expectedCenter, expectedZoom)
    })

    it('starts updating avatar position when changed', () => {
      expect(wrapper.vm.position).toEqual(position.coords)
    })

    it('saves watcher id', () => {
      expect(wrapper.vm.positionWatcher).toEqual(watchId)
    })

    it('shows an avatar on map', () => {
      const avatar = wrapper.find('.Avatar_test')
      expect(avatar.exists()).toBe(true)
    })
  })

  describe('after "toggle watch position btn" turns off', () => {
    beforeAll(async () => {
      wrapper.vm.showPosition = true
      toggle.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('stops watching position', () => {
      expect(geolocationMocks.clearWatch).toHaveBeenCalledWith(watchId)
    })

    it('shows no avatar on map', () => {
      const avatar = wrapper.find('.Avatar_test')
      expect(avatar.exists()).toBe(false)
    })
  })
})
