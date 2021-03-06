import { mountQuasar } from '@test'
import BasicMap from './BasicMap'
import { latLng } from 'leaflet'

const navigatorPosition = {
  coords: {
    latitude: 30,
    longitude: 40,
    accuracy: 10
  }
}
const expectedCenter = latLng(navigatorPosition.coords.latitude, navigatorPosition.coords.longitude)
const expectedZoom = 9
const watchId = 1234567890

const geolocationMocksSuccess = {
  getCurrentPosition: jest.fn((positionFct, errorFct) => { positionFct(navigatorPosition) }),
  watchPosition: jest.fn((positionFct, errorFct) => {
    positionFct(navigatorPosition)
    return watchId
  }),
  clearWatch: jest.fn()
}

const positionError = new Error('position error')
const geolocationMocksFailure = {
  getCurrentPosition: jest.fn((positionFct, errorFct) => { errorFct(positionError) }),
  watchPosition: jest.fn((positionFct, errorFct) => { errorFct(positionError) }),
  clearWatch: jest.fn()
}

const setView = jest.fn()
const getZoom = () => 0

const testInnerHeight = 120
const testFooterHeaderHeight = 10
global.window.innerHeight = testInnerHeight
global.document.getElementsByClassName = className => {
  if (className === 'q-header' || className === 'q-footer') {
    return {
      item: i => {
        return { clientHeight: testFooterHeaderHeight }
      }
    }
  } else return global.document.getElementsByClassName
}

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

  describe('after "toggle watch position btn" turns on and succeeds', () => {
    beforeAll(async () => {
      global.navigator.geolocation = geolocationMocksSuccess
      wrapper.vm.showPosition = false
      toggle.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('moves to currentPosition and zooms to level 9', () => {
      expect(setView).toHaveBeenCalledWith(expectedCenter, expectedZoom)
    })

    it('starts updating avatar position when changed', () => {
      expect(wrapper.vm.position.latLng).toEqual(expectedCenter)
      expect(wrapper.vm.position.accuracy).toEqual(navigatorPosition.accuracy)
    })

    it('saves watcher id', () => {
      expect(wrapper.vm.positionWatcher).toEqual(watchId)
    })

    it('shows an avatar on map', () => {
      const avatar = wrapper.find('.Avatar_test')
      expect(avatar.exists()).toBe(true)
    })

    afterAll(jest.clearAllMocks)
  })

  describe('after "toggle watch position btn" turns off', () => {
    beforeAll(async () => {
      global.navigator.geolocation = geolocationMocksSuccess
      wrapper.vm.showPosition = true
      toggle.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('stops watching position', () => {
      expect(geolocationMocksSuccess.clearWatch).toHaveBeenCalledWith(watchId)
    })

    it('shows no avatar on map', () => {
      const avatar = wrapper.find('.Avatar_test')
      expect(avatar.exists()).toBe(false)
    })

    afterAll(jest.clearAllMocks)
  })

  describe('after "toggle watch position btn" turns on and fails', () => {
    beforeAll(async () => {
      global.navigator.geolocation = geolocationMocksFailure
      wrapper.vm.showPosition = false
      toggle.vm.$emit('click')
      await wrapper.vm.$nextTick()
    })

    it('stops watching position', () => {
      expect(geolocationMocksFailure.clearWatch).toHaveBeenCalledWith(watchId)
    })

    it('shows no avatar on map', () => {
      const avatar = wrapper.find('.Avatar_test')
      expect(avatar.exists()).toBe(false)
    })

    it('sets "showPosition" to false', () => {
      expect(wrapper.vm.showPosition).toBe(false)
    })

    afterAll(jest.clearAllMocks)
  })

  describe('when height prop is given in percent', () => {
    beforeAll(async () => {
      wrapper.setProps({ height: '80%' })
      await wrapper.vm.$nextTick()
    })

    it('sets height to that percentage of page height', () => {
      expect(wrapper.html()).toContain('height: 80px')
    })
  })

  describe('when destroyed', () => {
    beforeAll(async () => {
      global.navigator.geolocation = geolocationMocksSuccess
      wrapper.destroy()
      await wrapper.vm.$nextTick()
    })

    it('stops watching position', () => {
      expect(geolocationMocksSuccess.clearWatch).toHaveBeenCalled()
    })

    afterAll(jest.clearAllMocks)
  })
})
