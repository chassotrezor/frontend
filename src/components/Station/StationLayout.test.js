import { mountQuasar } from '@test'
import StationLayout from './StationLayout'

const trailId = 'testTrailId'
const stationId = 'testStationId'

const $route = {
  params: {
    trailId,
    stationId
  }
}

const store = {
  modules: {
    trail: {
      namespaced: true,
      actions: {
        downloadStation: jest.fn()
      },
      getters: {
        getStation: state => () => state.station
      },
      mutations: {
        setStation: (state, station) => { state.station = station }
      },
      state: () => {
        return {
          station: undefined
        }
      }
    },
    user: {
      namespaced: true,
      getters: {
        openTrails: state => state.openTrails
      },
      mutations: {
        setopenTrails: (state, openTrails) => { state.openTrails = openTrails }
      },
      state: () => {
        return {
          openTrails: []
        }
      }
    }
  }
}

const wrapper = mountQuasar(StationLayout, {
  store,
  mocks: {
    $route
  }
})

describe('StationLayout', () => {
  it('displays a "SpinnerWithMessage" component', () => {
    const spinner = wrapper.find('.SpinnerWithMessage_test')
    expect(spinner.exists()).toBe(true)
  })

  describe('when "playerIsChasing" is true', () => {
    beforeAll(done => {
      wrapper.vm.$store.commit('user/setopenTrails', [trailId])
      wrapper.vm.$nextTick(done)
    })

    describe('when station data is downloaded', () => {
      beforeAll(done => {
        store.modules.trail.actions.downloadStation.mockResolvedValue()
        wrapper.vm.$store.commit('trail/setStation', { isTrailEntry: true })
        wrapper.vm.$nextTick(done)
      })

      it('does not display a "SpinnerWithMessage" component', () => {
        const spinner = wrapper.find('.SpinnerWithMessage_test')
        expect(spinner.exists()).toBe(false)
      })

      it('displays "Station" component', () => {
        const station = wrapper.find('.Station_test')
        expect(station.exists()).toBe(true)
      })

      it('does not display trailInfo component', () => {
        const trailInfo = wrapper.find('.TrailInfo_test')
        expect(trailInfo.exists()).toBe(false)
      })

      describe('when "station.isTrailEntry" is true', () => {
        beforeAll(done => {
          wrapper.vm.$store.commit('trail/setStation', { isTrailEntry: true })
          wrapper.vm.$nextTick(done)
        })

        it('does not display a "StartTrail" component', () => {
          const startTrail = wrapper.find('.StartTrail_test')
          expect(startTrail.exists()).toBe(false)
        })
      })
    })
  })

  describe('when "playerIsChasing" is false', () => {
    beforeAll(done => {
      wrapper.vm.$store.commit('user/setopenTrails', [])
      wrapper.vm.$nextTick(done)
    })

    it('does not display station component', () => {
      const station = wrapper.find('.Station_test')
      expect(station.exists()).toBe(false)
    })

    it('displays trailInfo slot', () => {
      const trailInfo = wrapper.find('.TrailInfo_test')
      expect(trailInfo.exists()).toBe(true)
    })

    describe('when "isTrailEntry" prop is true', () => {
      beforeAll(done => {
        wrapper.vm.$store.commit('trail/setStation', { isTrailEntry: true })
        wrapper.vm.$nextTick(done)
      })

      it('displays a "StartTrail" component', () => {
        const startTrail = wrapper.find('.StartTrail_test')
        expect(startTrail.exists()).toBe(true)
      })
    })
  })
})
