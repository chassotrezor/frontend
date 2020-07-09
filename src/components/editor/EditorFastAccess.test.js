import { mountQuasar } from '@test'
import EditorFastAccess from './EditorFastAccess'

const testTrailId = 'testTrailId'
const testStationId = 'testStationId'

const store = {
  modules: {
    editor: {
      namespaced: true,
      getters: {
        getTrail: () => () => {
          return {
            name: 'testTrailName',
            id: testTrailId,
            nodes: {
              [testStationId]: {
                name: 'testStationName'
              }
            }
          }
        }
      }
    }
  }
}

describe('EditorFastAccess', () => {
  const wrapper = mountQuasar(EditorFastAccess, {
    store
  })

  it('displays a "unselect" button', () => {
    const btn = wrapper.find('.UnselectBtn_test')
    expect(btn.exists()).toBe(true)
  })

  it('emits "unselect" value when "unselect" button emits "click"', () => {
    const btn = wrapper.find('.UnselectBtn_test')
    btn.vm.$emit('click')
    expect(wrapper.emitted().unselect).toBeTruthy()
  })

  describe('when "selectedTrail" is undefined', () => {
    beforeAll(async () => {
      wrapper.setProps({
        selectedTrail: undefined,
        selectedStation: undefined
      })
      await wrapper.vm.$nextTick()
    })

    it('displays no "TrailName_test" QBtn', () => {
      const trailName = wrapper.find('.TrailName_test')
      expect(trailName.exists()).toBe(false)
    })

    it('displays no "StationName_test" QBtn', () => {
      const stationName = wrapper.find('.StationName_test')
      expect(stationName.exists()).toBe(false)
    })
  })

  describe('when "selectedTrail" is defined and "selectedStation" is undefined', () => {
    beforeAll(async () => {
      wrapper.setProps({
        selectedTrail: testTrailId,
        selectedStation: undefined
      })
      await wrapper.vm.$nextTick()
    })

    it('displays a "TrailName_test" QBtn', () => {
      const trailName = wrapper.find('.TrailName_test')
      expect(trailName.exists()).toBe(true)
    })

    describe('when "TrailName_test" QBtn emits "click"', () => {
      beforeAll(async () => {
        const trailName = wrapper.find('.TrailName_test')
        trailName.vm.$emit('click')
        await wrapper.vm.$nextTick()
      })

      it('emits "editTrail"', () => {
        expect(wrapper.emitted().editTrail).toBeTruthy()
      })
    })

    it('displays no "StationName_test" QBtn', () => {
      const stationName = wrapper.find('.StationName_test')
      expect(stationName.exists()).toBe(false)
    })
  })

  describe('when "selectedTrail" and "selectedStation" are defined', () => {
    beforeAll(async () => {
      wrapper.setProps({
        selectedTrail: testTrailId,
        selectedStation: testStationId
      })
      await wrapper.vm.$nextTick()
    })

    it('displays a "TrailName_test" QBtn', () => {
      const trailName = wrapper.find('.TrailName_test')
      expect(trailName.exists()).toBe(true)
    })

    it('displays a "StationName_test" QBtn', () => {
      const stationName = wrapper.find('.StationName_test')
      expect(stationName.exists()).toBe(true)
    })
  })
})
